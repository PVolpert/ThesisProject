package signalingServer

import (
	"context"
	"fmt"

	"github.com/PVolpert/ctxValueBuilder"
)

type message struct {
	Type   string      `json:"type,omitempty"`
	Target *userId     `json:"target,omitempty"`
	Origin *userId     `json:"origin,omitempty"`
	Body   interface{} `json:"body,omitempty"`
}

// Context

const messageContextKey = "MessageKey"

func msgToContext(ctx context.Context, msg message) context.Context {
	toCtxFunc := ctxValueBuilder.ToContext[string, message]()
	return toCtxFunc(ctx, messageContextKey, msg)
}

func msgFromContext(ctx context.Context) (message, error) {
	fromCtxFunc := ctxValueBuilder.FromContext[string, message](fmt.Errorf("no message found"))
	return fromCtxFunc(ctx, messageContextKey)
}

const userListMessageType string = "userList"

// UserList Message

type userListBody struct {
	Users []userId `json:"users"`
}

func createUserListMessage(users []userId) message {
	msg := message{Type: userListMessageType, Body: userListBody{Users: users}}
	return msg
}

// UserOffline Messages

const userOfflineMessageType string = "userOffline"

type userOfflineBody struct {
	User userId `json:"user,omitempty"`
}

func createUserOfflineMessage(user userId) message {
	msg := message{
		Type: userOfflineMessageType,
		Body: userOfflineBody{user},
	}
	return msg
}

// userOnline message

const userOnlineMessageType string = "userOnline"

type userOnlineBody struct {
	User userId `json:"user,omitempty"`
}

func createUserOnlineMessage(user userId) message {
	msg := message{
		Type: userOnlineMessageType,
		Body: userOnlineBody{user},
	}
	return msg
}

// Signaling Messages

func createSignalingMessage(msgType string, origin userId, body interface{}) message {
	msg := message{
		Type:   msgType,
		Origin: &origin,
		Body:   body,
	}
	return msg
}
