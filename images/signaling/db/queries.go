package db

import log "github.com/sirupsen/logrus"

func baseQuery(query string) func() (resp string, err error) {
	return func() (resp string, err error) {
		db, err := connectToDB()
		if err != nil {
			log.Error(err)
			return "", err
		}
		defer db.Close()

		rows, err := db.Query(query)
		if err != nil {
			log.Error(err)
			return "", err
		}
		defer rows.Close()
		for rows.Next() {
			err = rows.Scan(&resp)
			if err != nil {
				log.Error(err)
				return "", err
			}
		}
		return resp, nil
	}
}
