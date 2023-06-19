package signalingServer

import (
	"context"
	// "math/rand"

	// "github.com/PVolpert/ctxValueBuilder"
	"github.com/PVolpert/oidcauth"
)

type userId struct {
	Issuer  string `json:"issuer,omitempty"`
	Subject string `json:"subject,omitempty"`
}

// userId + Display Information
type userInfo struct {
	userId
	Username string `json:"username,omitempty"`
}

// const userIdContextKey = "UserIDKey"

func isTargetValid(id userId) bool {
	if id.Issuer == "" || id.Subject == "" {
		return false
	}
	return true
}

func idFromContext(ctx context.Context) (*userId, error) {
	token, _, err := oidcauth.FromContext(ctx)
	if err != nil {
		return nil, err
	}
	return &userId{token.Issuer(), token.Subject()}, nil
}

func usernameFromContext(ctx context.Context) string {
	_, claims, err := oidcauth.FromContext(ctx)
	if err != nil {
		return ""
	}
	switch typedUsername := claims["preferred_username"].(type) {
	case string:
		return typedUsername
	default:
		return ""
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
