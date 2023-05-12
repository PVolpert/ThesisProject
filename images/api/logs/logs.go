package logs

import (
	"api/env"

	log "github.com/sirupsen/logrus"
)

func SetLogLevel() {
	phase := env.Get("STAGE", "Development")
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
