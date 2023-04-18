package main

import (
	"api/contexts"
	"api/env"
	"api/handlers"
	"api/logs"
	"fmt"

	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/docgen"
	"github.com/go-chi/render"

	log "github.com/sirupsen/logrus"
)

var (
	routesEnv        = env.Get("ROUTES", "")
	corsEnv   string = env.Get("CORS", "http://localhost:2000")
	portEnv          = env.Get("PORT", "80")
)

func main() {

	logs.SetLogLevel()

	router := chi.NewRouter()
	// Logs the start and end of each request with the elapsed processing time
	router.Use(middleware.Logger)
	// Injects a request ID into the context of each request
	router.Use(middleware.RequestID)
	// Gracefully absorb panics and prints the stack trace
	router.Use(middleware.Recoverer)
	// Sets content type to JSON
	router.Use(render.SetContentType(render.ContentTypeJSON))

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{corsEnv}, // Use this to allow specific origin hosts
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
	// Authentication Token needed
	router.Group(func(r chi.Router) {

		// ? Past here can be routes
		r.Route("/friends", func(r chi.Router) {
			r.Get("/", handlers.DummyHandler)

			r.Route("/friendID", func(r chi.Router) {
				r.Use(contexts.DummyCtx)
				r.Get("/", handlers.DummyHandler)
				r.Put("/", handlers.DummyHandler)
				r.Delete("/", handlers.DummyHandler)
			})
		})

		r.Route("/signaling", func(r chi.Router) {

		})
	})

	// No Authentication Token needed
	router.Group(func(r chi.Router) {
		router.Get("/", handlers.RootHandler)
		router.Get("/authProviderInfo", handlers.GetAuthProviderInfoHandler)
		router.Get("/ictProviderInfo", handlers.GetICTProviderInfoHandler)
	})

	// Generate documentation for router if ROUTES Env is set
	if len(routesEnv) != 0 {
		fmt.Println(docgen.MarkdownRoutesDoc(router, docgen.MarkdownOpts{
			ProjectPath: "github.com/elarodas/thesisproject/api",
			Intro:       "generated REST docs for api",
		}))
		return
	}

	log.Info(fmt.Sprintf("Go API started on Port %s", portEnv))
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", portEnv), router))
}
