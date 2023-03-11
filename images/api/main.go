package main

import (
	"api/env"
	"api/handlers"
	"fmt"

	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	log "github.com/sirupsen/logrus"
)

func main() {

	setLog()

	log.Debug("Test the debug level")
	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Get("/", handlers.RootHandler)
	router.Get("/authServerInfo", handlers.GetAuthServerInfoHandler)

	port := env.Get("PORT", "80")

	log.Info("Go API started on Port", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), router))
}

func setLog() {
	phase := env.Get("STAGE", "Production")
	log.SetReportCaller(true)
	switch phase {
	case "Production":
		setProdLog()
	case "Development":
		setDevLog()
	}
}

func setProdLog() {
	log.SetLevel(log.InfoLevel)
	log.SetFormatter(&log.JSONFormatter{})
}

func setDevLog() {
	log.SetLevel(log.DebugLevel)
	log.SetFormatter(&log.TextFormatter{})
}
