package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	_ "github.com/lib/pq"
)

const (
	mqttBroker = "tcp://broker.emqx.io:1883"
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
	dbUser     = "toan"
	dbPassword = "password"
)

type deviceMesHandler struct{}

/*func (o *deviceMesHandler) MessageHandler(client mqtt.Client, message mqtt.Message) {
	fmt.Println("Config succesful")
}*/

var (
	connectHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
		log.Println("Connected")
	}
)
var (
	messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, message mqtt.Message) {
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
)
var connectLostHandler mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	//client = mqtt.ClientOptions{}
	log.Println("connect lost ", err)
}

func main() {
	fmt.Println("Welcome to my project")
	//Database o day
	connectionDatabase := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)
	db, err := sql.Open("postgres", connectionDatabase)
	if err != nil {
		log.Println("Cannoct connect to Database")
		fmt.Println("Cannot connect to Database")
	} else {
		log.Println("Success open Database")
	}
	err = db.Ping()

	if err != nil {
		log.Println("Cannoct ping to Database ", err)
		fmt.Println("Cannot ping Database: ", err)
	} else {
		fmt.Println("Success ping Database")
	}
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS devices (id VARCHAR(255) PRIMARY KEY NOT NULL)")
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS server (timestamp timestamp PRIMARY KEY NOT NULL, status bool)")
	db.SetMaxIdleConns(4)
	db.SetMaxOpenConns(4)

	//MQTT o day
	//Server
	opts := mqtt.NewClientOptions()
	opts.AddBroker(mqttBroker)
	opts.SetClientID("iot-dms_client")
	opts.SetPassword("emqx")
	opts.SetDefaultPublishHandler(messagePubHandler)
	opts.OnConnect = connectHandler
	opts.OnConnectionLost = connectLostHandler

	//Device
	opts2 := mqtt.NewClientOptions()
	opts2.AddBroker(mqttBroker)
	opts2.SetClientID("iot-dms_device_1")
	opts2.SetPassword("emqx1")
	//opts2.SetAutoReconnect()
	opts2.SetDefaultPublishHandler(messagePubHandler)
	opts2.OnConnect = connectHandler
	opts2.OnConnectionLost = connectLostHandler

	client_server := mqtt.NewClient(opts)
	client_device := mqtt.NewClient(opts2)
	if token := client_server.Connect(); token.Wait() && token.Error() != nil {
		log.Println("Error connecting to MQTT broker: ", token.Error())
	} else {
		log.Println("Server connected succesfully to MQTT Broker")
	}
	if token := client_device.Connect(); token.Wait() && token.Error() != nil {
		log.Println("Error connecting to MQTT broker: ", token.Error())
	} else {
		log.Println("Device connected successfully to MQTT Broker")
	}
	sub(client_server, mqttTopic, 2)
	pub(client_device, mqttTopic, 2, datas)
}

func pub(client mqtt.Client, topic string, qos byte, datas data) {
	token := client.Publish(topic, qos, false, datas)
	token.Wait()
	time.Sleep(time.Second)
	/*if token.Error != nil {
		log.Println("Cannot publishing to mqtt Topic")
	} else {*/
	log.Println("Sucessful publishing to mqtt Topic")
	//}
}
func sub(client mqtt.Client, topic string, qos byte) {
	token := client.Subscribe(topic, qos, messagePubHandler)
	token.Wait()
	/*if token.Error != nil {
		log.Println("Cannot subcribing to mqtt Topic ", token.Error)
	} else {*/
	log.Println("Sucessful subcribing to mqtt Topic")
	//}
}
