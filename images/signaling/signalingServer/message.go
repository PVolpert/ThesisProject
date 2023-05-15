package signalingServer

import (
	"context"
	"fmt"

	"github.com/ElarOdas/ctxValueBuilder"
	"nhooyr.io/websocket"
)

type message struct {
	Type   string      `json:"type,omitempty"`
	Target userId      `json:"target,omitempty"`
	Origin userId      `json:"origin,omitempty"`
	Body   interface{} `json:"body,omitempty"`
}

const messageContextKey = "MessageKey"

type activeUsersBody struct {
	Users []userId `json:"users"`
}

func (sig *signalingServer) handleActiveUsersMessage(ctx context.Context, c *websocket.Conn) error {
	msg, err := msgFromContext(ctx)
	if err != nil {
		return err
	}
	origin, err := idFromContext(ctx)
	if err != nil {
		return err
	}

	activeUsers := sig.getSubscriberSlice()

	return sig.sendToUser(origin, message{Type: msg.Type, Body: activeUsersBody{Users: activeUsers}})
}

func (sig *signalingServer) handleSDPMessage(ctx context.Context, c *websocket.Conn) error {
	msg, err := msgFromContext(ctx)
	if err != nil {
		return err
	}
	origin, err := idFromContext(ctx)
	if err != nil {
		return err
	}
	return sig.sendToUser(msg.Target, message{Type: msg.Type, Origin: origin, Body: msg.Body})
}

type userChangeBody struct {
	User userId `json:"user"`
}

func msgToContext(ctx context.Context, msg message) context.Context {
	toCtxFunc := ctxValueBuilder.ToContext[string, message]()
	return toCtxFunc(ctx, messageContextKey, msg)
}

func msgFromContext(ctx context.Context) (message, error) {
	fromCtxFunc := ctxValueBuilder.FromContext[string, message](fmt.Errorf("no message found"))
	return fromCtxFunc(ctx, userIdContextKey)
}
