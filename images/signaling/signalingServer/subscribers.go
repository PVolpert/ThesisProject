package signalingServer

// subscriber represents a subscriber.
// Messages are sent on the msgs channel and if the client
// cannot keep up with the messages, closeSlow is called.
type subscriber struct {
	msgs      chan message
	closeSlow func()
	username  string
}

// addSubscriber registers a subscriber.
func (sig *signalingServer) addSubscriber(user *userId, s *subscriber) {
	sig.subscribersMu.Lock()
	sig.subscribers[*user] = s
	sig.subscribersMu.Unlock()
	sig.logf("adding %s", *user)

	msg := createUserOnlineMessage(*user)
	sig.broadcast(msg)
}

// deleteSubscriber deletes the given subscriber.
func (sig *signalingServer) deleteSubscriber(user *userId) {
	sig.subscribersMu.Lock()
	delete(sig.subscribers, *user)
	sig.subscribersMu.Unlock()
	sig.logf("kicking %s", *user)
	msg := createUserOfflineMessage(*user)
	sig.broadcast(msg)
}

func (sig *signalingServer) getSubscriberSlice() []userId {
	sig.subscribersMu.Lock()
	defer sig.subscribersMu.Unlock()
	var userList []userId
	for user, _ := range sig.subscribers {

		userList = append(userList, user)
	}
	return userList
}
