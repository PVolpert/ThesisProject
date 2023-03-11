package env

import (
	"fmt"
	log "github.com/sirupsen/logrus"
	"os"
)

// return Env Variable or substitute
func Get(key string, substitute string) string {
	envvar := os.Getenv(key)

	if len(envvar) == 0 {
		log.Info(fmt.Sprintf("Envvar %s not found, replaced with %s", key, substitute))
		return substitute
	}
	return envvar
}
