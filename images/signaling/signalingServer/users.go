package signalingServer

import (
	"context"
	"errors"
	// "math/rand"

	// "github.com/PVolpert/ctxValueBuilder"
	"github.com/PVolpert/oidcauth"
)

type userId struct {
	Username string `json:"username,omitempty"`
}

// const userIdContextKey = "UserIDKey"

func isTargetValid(id userId) bool {
	if id.Username == "" {
		return false
	}
	return true
}

func idFromContext(ctx context.Context) (*userId, error) {
	_, claims, err := oidcauth.FromContext(ctx)
	if err != nil {
		return nil, err
	}
	switch typedUsername := claims["preferred_username"].(type) {
	case string:
		return &userId{typedUsername}, nil
	default:
		err := errors.New("Username argument not found")
		return nil, err
	}
}

// ! For testing purposes only

// func idToContext(ctx context.Context, id userId) context.Context {
// 	toCtxFunc := ctxValueBuilder.ToContext[string, userId]()
// 	return toCtxFunc(ctx, userIdContextKey, id)
// }

// ! For testing purposes only
// func RandomString(n int) string {
// 	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

// 	s := make([]rune, n)
// 	for i := range s {
// 		s[i] = letters[rand.Intn(len(letters))]
// 	}
// 	return string(s)
// }
