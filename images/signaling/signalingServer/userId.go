package signalingServer

import (
	"context"
	"fmt"
	"math/rand"

	"github.com/ElarOdas/ctxValueBuilder"
)

type userId string

const userIdContextKey = "UserIDKey"

func idFromContext(ctx context.Context) (userId, error) {
	fromCtxFunc := ctxValueBuilder.FromContext[string, userId](fmt.Errorf("no userID found"))
	return fromCtxFunc(ctx, userIdContextKey)
}

func idToContext(ctx context.Context, id userId) context.Context {
	toCtxFunc := ctxValueBuilder.ToContext[string, userId]()
	return toCtxFunc(ctx, userIdContextKey, id)
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
