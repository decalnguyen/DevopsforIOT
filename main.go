package main

import (
	"database/sql"
	"fmt"
	"log"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	_ "github.com/lib/pq"
)

const (
	mqttBroker = "tcp://mqtt.iot-dms.com:1883"
	mqttTopic  = "home/device/status"
)

type data struct {
	id     string
	status bool
}

var datas = data{
	"123",
	true,
}

const (
	dbHost     = "localhost"
	dbPort     = 5432
	dbName     = "IOT-DMS"
	dbUser     = "nhattoan"
	dbPassword = "Toan02102004."
)

func initDatabase() {

}
func main() {
	fmt.Println("Welcome to my project")
	db, err := sql.Open("postgres", "host=dbHost port=dbPort dbnam=dbName user=dbUser password=dbPassword")

	if err != nil {
		log.Println("Cannoct connect to Database")
		fmt.Println("Cannot connect to Database")
	}
	err = db.Ping()

	if err != nil {
		log.Println("Cannoct ping to Database")
		fmt.Println("Cannot ping Database")
	}
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS devices (id VARCHAR(255) PRIMARY KEY NOT NULL)")
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS server (timestamp timestamp PRIMARY KEY NOT NULL, status bool)")
	db.SetMaxIdleConns(10)
	opts := mqtt.NewClientOptions()
	opts.AddBroker(mqttBroker)
	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Println("Error connecting to MQTT broker: ", token.Error())
	} else {
		log.Println("Connected to MQTT Broker")
	}
	if server := client.Subscribe(mqttTopic, 1, messageHandler); server.Wait() && server.Error() != nil {
		log.Println("Cannot subcribing to mqttTopic: ", server.Error())
	}
	if device := client.Publish(mqttTopic, 1, false, datas); device.Wait() && device.Error() != nil {
		log.Println("Cannot publishing to mqtt Topic: ", device.Error())
	}
}
func messageHandler(client mqtt.Client, message mqtt.Message) {
	db, err := sql.Open("postgres", "host=dbHost port=dbPort dbnam=dbName user=dbUser password=dbPassword")
	err = db.Ping()
	for err != nil {
		log.Println("Cannot ping to Database to persist data")
		err = db.Ping()
	}
	mss := message.Payload()
	_, err = db.Exec("INSERT INTO devices (id) VALUES ($1, $2)", mss[0], mss[1])
	for err != nil {
		log.Println("Fail to persist data into table devices")
		_, err = db.Exec("INSERT INTO devices (id) VALUES ($1, $2)", mss[0], mss[1])
	}
	log.Println("Success to persist data into table devices")
}
