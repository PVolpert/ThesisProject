package signalingServer

// subscriber represents a subscriber.
// Messages are sent on the msgs channel and if the client
// cannot keep up with the messages, closeSlow is called.
type subscriber struct {
	msgs      chan message
	closeSlow func()
}

// addSubscriber registers a subscriber.
func (sig *signalingServer) addSubscriber(id userId, s *subscriber) {
	sig.subscribersMu.Lock()
	sig.subscribers[id] = s
	sig.subscribersMu.Unlock()
	sig.logf("adding %s", id)
	// ? Maybe move from addSubscriber
	sig.broadcast(message{
		Type: "UserOnline",
		Body: userChangeBody{id},
	})
}

// deleteSubscriber deletes the given subscriber.
func (sig *signalingServer) deleteSubscriber(id userId) {
	sig.subscribersMu.Lock()
	delete(sig.subscribers, id)
	sig.subscribersMu.Unlock()

	sig.logf("kicking %s", id)
	// ? Maybe move from deleteSubscriber
	sig.broadcast(message{
		Type: "UserOffline",
		Body: userChangeBody{id},
	})
}

func (sig *signalingServer) getSubscriberSlice() []userId {
	sig.subscribersMu.Lock()
	defer sig.subscribersMu.Unlock()
	var userList []userId
	for key := range sig.subscribers {
		userList = append(userList, key)
	}
	return userList
}
