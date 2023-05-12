package signalingServer

import "fmt"

func (sig *signalingServer) sendToUser(id userId, msg message) error {
	sig.subscribersMu.Lock()
	defer sig.subscribersMu.Unlock()

	target := sig.subscribers[id]
	if target == nil {
		return fmt.Errorf("no such sub online")
	}

	select {
	case target.msgs <- msg:
	default:
		go target.closeSlow()
	}
	return nil
}

func (sig *signalingServer) broadcast(msg message) {
	sig.subscribersMu.Lock()
	defer sig.subscribersMu.Unlock()
	for _, s := range sig.subscribers {
		select {
		case s.msgs <- msg:
		default:
			go s.closeSlow()
		}
	}
}
