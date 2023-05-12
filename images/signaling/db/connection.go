package db

import (
	"database/sql"
	"fmt"

	"signaling/env"

	_ "github.com/lib/pq"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

type dBConfig struct {
	DBPassword string `mapstructure:"SIGNALING_PW"`
	DBName     string `mapstructure:"WEBAPP_DB"`
	DBUser     string `mapstructure:"SIGNALING_NAME"`
}

func loadConfig() (config dBConfig, err error) {

	configPath := env.Get("DB_LOGIN", "/run/secrets/db-user-signaling")
	viper.SetConfigFile(configPath)
	viper.SetConfigType("env")
	viper.AutomaticEnv()
	err = viper.ReadInConfig()
	if err != nil {
		log.Error(err)
		return
	}
	err = viper.Unmarshal(&config)
	return
}

func connectToDB() (db *sql.DB, err error) {

	var (
		host = env.Get("DB_HOST", "db")
		port = env.Get("DB_PORT", "5432")
	)

	config, err := loadConfig()
	if err != nil {
		log.Error(err)
		return nil, err
	}
	// Connect to the PostgreSQL server
	psqlconn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", host, port, config.DBUser, config.DBPassword, config.DBName)
	db, err = sql.Open("postgres", psqlconn)
	if err != nil {
		log.Error(err)
		return nil, err
	}

	// Verify that the connection is working
	err = db.Ping()
	if err != nil {
		log.Error(err)
		return nil, err
	}
	return db, nil
}
