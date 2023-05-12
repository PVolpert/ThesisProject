package main

import (
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"api/env"
	"api/handlers"
	"api/logs"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/docgen"
	log "github.com/sirupsen/logrus"
)

func main() {
	logs.SetLogLevel()

	err := run()
	if err != nil {
		log.Fatal(err)
	}
}

func run() error {
	var (
		routesEnv string = env.Get("ROUTES", "")
		portEnv   string = env.Get("PORT", "80")
	)
	router := NewRouter()
	// Generate documentation for router if ROUTES Env is set
	if len(routesEnv) != 0 {
		fmt.Println(docgen.MarkdownRoutesDoc(router, docgen.MarkdownOpts{
			ProjectPath: "github.com/elarodas/thesisproject/api",
			Intro:       "generated REST docs for api",
		}))
		return nil
	}

	errCh := make(chan error, 1)

	go func() {
		log.Info(fmt.Sprintf("API Server started on Port %s", portEnv))
		errCh <- http.ListenAndServe(fmt.Sprintf(":%s", portEnv), router)
	}()

	osSigCh := make(chan os.Signal, 1)
	signal.Notify(osSigCh, os.Interrupt, syscall.SIGTERM)

	select {
	case err := <-errCh:
		log.Error("failed to serve: %v", err)
		return err
	case sig := <-osSigCh:
		log.Info("terminating: %v", sig)
		return nil
	}
}

func NewRouter() *chi.Mux {
	var (
		corsEnv string = env.Get("CORS", "http://client.localhost")
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

	// No Authentication Token needed
	router.Group(func(r chi.Router) {
		router.Get("/", handlers.RootHandler)
		router.Get("/authProviderInfo", handlers.GetAuthProviderInfoHandler)
		router.Get("/ictProviderInfo", handlers.GetICTProviderInfoHandler)
	})

	return router
}
