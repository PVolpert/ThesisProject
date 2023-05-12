package main

import (
	"fmt"
	"signaling/env"
	"signaling/signalingServer"
	"syscall"

	"net/http"
	"os"
	"os/signal"

	// "github.com/ElarOdas/oidcauth"
	// "github.com/ElarOdas/oidcauth/offline"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	log "github.com/sirupsen/logrus"
)

func main() {
	err := run()
	if err != nil {
		log.Fatal(err)
	}
}

// run starts a http.Server for the passed in address
// with all requests handled by echoServer.
func run() error {
	var (
		portEnv string = env.Get("PORT", "2001")
	)
	router := NewRouter()

	sig := signalingServer.New()

	router.Get("/", sig.SocketHandler)

	errCh := make(chan error, 1)
	go func() {
		log.Info(fmt.Sprintf("Signaling Server started on Port %s", portEnv))
		errCh <- http.ListenAndServe(fmt.Sprintf(":%s", portEnv), router)
	}()

	osSigs := make(chan os.Signal, 1)
	signal.Notify(osSigs, os.Interrupt, syscall.SIGTERM)
	select {
	case err := <-errCh:
		log.Printf("failed to serve: %v", err)
		return err
	case sig := <-osSigs:
		log.Printf("terminating: %v", sig)
		return nil
	}

}

func NewRouter() *chi.Mux {
	var (
		corsEnv string = env.Get("CORS", "http://client.localhost")
		// authProviderEnv string = env.Get("PROVIDER", "http://op:8080/realms/auth")
		// audienceEnv     string = env.Get("AUDIENCE", "thesisProject-Client")
	)
	router := chi.NewRouter()
	// Logs the start and end of each request with the elapsed processing time
	router.Use(middleware.Logger)
	// Injects a request ID into the context of each request
	router.Use(middleware.RequestID)
	// Gracefully absorb panics and prints the stack trace
	router.Use(middleware.Recoverer)

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{corsEnv}, // Use this to allow specific origin hosts
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))
	// authProvider, err := offline.New(authProviderEnv, audienceEnv, time.Hour)
	// // ? Could also be a recovery
	// if err != nil {
	// 	panic(err)
	// }

	// router.Use(oidcauth.Verifier(authProvider))
	// router.Use(oidcauth.Authenticator)

	return router
}
