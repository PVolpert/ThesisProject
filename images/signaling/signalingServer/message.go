package signalingServer

import (
	"context"
	"fmt"
	"time"

	"nhooyr.io/websocket"
)

type message struct {
	Type   string      `json:"type,omitempty"`
	Target userId      `json:"target,omitempty"`
	Body   interface{} `json:"body,omitempty"`
}

func (sig *signalingServer) evalIncomingMessage(ctx context.Context, c *websocket.Conn, msg message) error {
	if msg.Type == "active" {
		err := sig.handleActiveUsersMessage(ctx, c, msg)
		return err
	}
	if msg.Type == "signal" && len(msg.Target) != 0 {
		err := sig.handleSDPMessage(ctx, c, msg)
		return err
	}
	return fmt.Errorf("no fitting message")
}

type activeUsersBody struct {
	Users []userId `json:"users"`
}

func (sig *signalingServer) handleActiveUsersMessage(ctx context.Context, c *websocket.Conn, msg message) error {
	activeUsers := sig.getSubscriberSlice()

	sig.subscribersMu.Lock()
	defer sig.subscribersMu.Unlock()
	err := writeTimeoutJSON(ctx, 10*time.Second, c, message{Type: msg.Type, Body: activeUsersBody{Users: activeUsers}})
	if err != nil {
		return err
	}
	return nil
}

func (sig *signalingServer) handleSDPMessage(ctx context.Context, c *websocket.Conn, msg message) error {
	return sig.sendToUser(msg.Target, message{Type: msg.Type, Body: msg.Body})
}

type userChangeBody struct {
	User userId `json:"user"`
}
