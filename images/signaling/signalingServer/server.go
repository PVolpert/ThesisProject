package signalingServer

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"sync"
	"time"

	log "github.com/sirupsen/logrus"

	"nhooyr.io/websocket"
	"nhooyr.io/websocket/wsjson"
)

type signalingServer struct {
	// subscriberMessageBuffer controls the max number
	// of messages that can be queued for a subscriber
	// before it is kicked.
	//
	// Defaults to 16.
	subscriberMessageBuffer int

	// logf controls where logs are sent.
	// Defaults to log.Printf.
	logf func(f string, v ...interface{})

	subscribersMu sync.Mutex
	subscribers   map[userId]*subscriber
}

func New() *signalingServer {
	sig := &signalingServer{
		subscriberMessageBuffer: 16,
		logf:                    log.Infof,
		subscribers:             make(map[userId]*subscriber),
	}

	return sig
}

func (sig *signalingServer) SocketHandler(w http.ResponseWriter, r *http.Request) {
	//* socket opening
	c, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		OriginPatterns: []string{"*"},
	})
	if err != nil {
		sig.logf("%v", err)
		return
	}
	defer c.Close(websocket.StatusInternalError, "the sky is falling")

	// TODO Replace with id from token
	ctx := idToContext(r.Context(), userId(RandomString(10)))

	//* socket logic
	err = sig.subscribe(ctx, c)

	//* socket closing
	// Handle error for subscription
	if errors.Is(err, context.Canceled) {
		return
	}
	if websocket.CloseStatus(err) == websocket.StatusNormalClosure ||
		websocket.CloseStatus(err) == websocket.StatusGoingAway {
		return
	}
	if err != nil {
		sig.logf("%v", err)
		return
	}
}

func (sig *signalingServer) subscribe(ctx context.Context, c *websocket.Conn) error {
	id, err := idFromContext(ctx)

	if err != nil {
		return err
	}

	sub := &subscriber{
		msgs: make(chan message, sig.subscriberMessageBuffer),
		closeSlow: func() {
			c.Close(websocket.StatusPolicyViolation, "connection too slow to keep up with messages")
		},
	}

	sig.addSubscriber(id, sub)
	defer sig.deleteSubscriber(id)

	incomingCh := make(chan error, 1)
	// start inital incoming channel handling
	go func() {
		incomingCh <- sig.incomingMsgHandler(ctx, c)
	}()
	for {
		select {
		// * Case: Incoming Message
		case err := <-incomingCh:
			// Handle possible error
			if err != nil {
				return err
			}
			// Handle next incoming msg
			go func() {
				incomingCh <- sig.incomingMsgHandler(ctx, c)
			}()
		//* Case: Outgoing message
		case msg := <-sub.msgs:
			err := writeTimeoutJSON(ctx, time.Second*5, c, msg)
			if err != nil {
				return err
			}
		//* Case: Request is over for unknown reason
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

// incomingMsgHandler reads from the WebSocket connection and then writes
// the received message back to it.
// The entire function has 10s to complete.
func (sig *signalingServer) incomingMsgHandler(ctx context.Context, c *websocket.Conn) error {
	var msg message
	err := wsjson.Read(ctx, c, &msg)
	if err != nil {
		return err
	}
	ctx = msgToContext(ctx, msg)

	return sig.evalIncomingMessage(ctx, c)
}

func writeTimeoutJSON(ctx context.Context, timeout time.Duration, c *websocket.Conn, msg message) error {
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	return wsjson.Write(ctx, c, msg)
}

func (sig *signalingServer) evalIncomingMessage(ctx context.Context, c *websocket.Conn) error {
	msg, err := msgFromContext(ctx)
	if err != nil {
		return err
	}
	if msg.Type == "active" {
		err := sig.handleActiveUsersMessage(ctx, c)
		return err
	}
	if (msg.Type == "offer" || msg.Type == "icecandidate" || msg.Type == "answer") && len(msg.Target) != 0 {
		err := sig.handleSDPMessage(ctx, c)
		return err
	}
	return fmt.Errorf("no fitting message")
}
