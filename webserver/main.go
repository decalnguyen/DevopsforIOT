package main

import (
	"database/sql"
	"fmt"
	"github.com/eclipse/paho.mqtt.golang"
	_ "github.com/lib/pq"
)

const (
	mqttBroker = "tcp://mqtt.iot-dms.com:1883"
	mqttTopic  = "home/status"
)

const (
	dbHost     = "localhost"
	dbPort     = 5432
	dbName     = "IOT-DMS"
	dbUser     = "nhattoan"
	dbPassword = "Toan02102004."
)

func main() {
	fmt.Println("Welcome to my project")
	db, err := sql.Open("postgres", "host=dbHost port=dbPort dbnam=dbName user=dbUser password=dbPassword")

	if err != nil {
		fmt.Println("Cannot connect to Database")
	}
	err = db.Ping()

	if err != nil {
		fmt.Println("Cannot ping Database")
	}
	db.SetMaxIdleConns(10)
}
