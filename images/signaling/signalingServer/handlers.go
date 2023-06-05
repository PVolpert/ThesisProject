package signalingServer

import (
	"context"
	"fmt"

	"nhooyr.io/websocket"
)

// ? In the future we could do something like go chi .Get for websockets
func (sig *signalingServer) incomingMessageHandler(ctx context.Context, c *websocket.Conn) error {
	msg, err := msgFromContext(ctx)
	if err != nil {
		return err
	}
	if msg.Type == userListMessageType {
		err := sig.handleUserListMessage(ctx, c)
		return err
	}
	if isTargetValid(*msg.Target) {
		err := sig.handleSignalingMessage(ctx, c)
		return err
	}
	return fmt.Errorf("no fitting message")
}

func (sig *signalingServer) handleUserListMessage(ctx context.Context, c *websocket.Conn) error {
	origin, err := idFromContext(ctx)
	if err != nil {
		return err
	}

	subscribers := sig.getSubscriberSlice()

	outgoingMsg := createUserListMessage(subscribers)

	return sig.sendToUser(origin, outgoingMsg)
}

func (sig *signalingServer) handleSignalingMessage(ctx context.Context, c *websocket.Conn) error {
	incomingMsg, err := msgFromContext(ctx)
	if err != nil {
		return err
	}
	origin, err := idFromContext(ctx)
	if err != nil {
		return err
	}
	outgoingMsg := createSignalingMessage(incomingMsg.Type, *origin, incomingMsg.Body)
	return sig.sendToUser(incomingMsg.Target, outgoingMsg)
}
