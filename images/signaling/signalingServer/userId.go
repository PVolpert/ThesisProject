package signalingServer

import (
	"context"
	"math/rand"
)

type userId string

func idFromContext(ctx context.Context) userId {

	// TODO Add function that takes name from token
	return userId(RandomString(10))
}

// ! For testing purposes only
func RandomString(n int) string {
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

	s := make([]rune, n)
	for i := range s {
		s[i] = letters[rand.Intn(len(letters))]
	}
	return string(s)
}
