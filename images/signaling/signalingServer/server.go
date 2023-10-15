package signalingServer

import (
	"context"
	"errors"
	"net/http"
	// "signaling/env"
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

	rateLimiter *time.Ticker

	subscribersMu sync.Mutex
	subscribers   map[userId]*subscriber
}

func New() *signalingServer {
	sig := &signalingServer{
		subscriberMessageBuffer: 16,
		logf:                    log.Infof,
		rateLimiter:             time.NewTicker(100 * time.Millisecond),
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

	//* socket logic
	err = sig.subscribe(r.Context(), c)

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
	// Get id from Token
	id, err := idFromContext(ctx)

	if err != nil {
		return err
	}
	// Create subscriber
	sub := &subscriber{
		msgs: make(chan message, sig.subscriberMessageBuffer),
		closeSlow: func() {
			c.Close(websocket.StatusPolicyViolation, "connection too slow to keep up with messages")
		},
	}
	// Add and remove from subscriber list
	sig.addSubscriber(id, sub)
	defer sig.deleteSubscriber(id)

	incomingCh := make(chan error, 1)
	// start inital incoming channel handling
	go func() {
		incomingCh <- sig.evalIncomingMessage(ctx, c)
	}()
	for {
		select {
		// * Case: Incoming Message
		case err := <-incomingCh:
			// Close loop if error
			if err != nil {
				return err
			}
			// Handle next incoming msg
			go func() {
				incomingCh <- sig.evalIncomingMessage(ctx, c)
			}()
		//* Case: Outgoing message
		case msg := <-sub.msgs:
			err := writeTimeoutJSON(ctx, time.Second*5, c, msg)
			// Close loop if error
			if err != nil {
				return err
			}
		//* Case: Request is over for unknown reason
		case <-ctx.Done():
			// Close loop
			return ctx.Err()
		}
	}
}

// evalIncomingMessage reads from the WebSocket connection and then writes
// the received message back to it.
// ! First point of contact, sanitization required
func (sig *signalingServer) evalIncomingMessage(ctx context.Context, c *websocket.Conn) error {
	var msg message
	// Extract the next json message from socket connection
	err := wsjson.Read(ctx, c, &msg)
	if err != nil {
		return err
	}
	// Store the message
	ctx = msgToContext(ctx, msg)

	return sig.incomingMessageHandler(ctx, c)
}

// Send the message
func writeTimeoutJSON(ctx context.Context, timeout time.Duration, c *websocket.Conn, msg message) error {
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	return wsjson.Write(ctx, c, msg)
}
