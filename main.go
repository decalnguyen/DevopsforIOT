package main

import (
	"bytes"
	"encoding/gob"
	"fmt"
	"log"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	mqttBroker = "tcp://broker.emqx.io:1883"
	mqttTopic  = "home/device/status"
)

type device struct {
	//gorm.Model
	id     string
	status bool
}

var (
	connectHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
		log.Println("Connected")
	}
)
var (
	messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, message mqtt.Message) {
		dsn := "host=localhost user=nhattoan password=test123 dbname=iot_dms port=5432 sslmode=disable"
		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Println("Cannot open Database")

		} else {
			log.Println("Successful openning database")
		}
		mss := message.Payload()
		var decodeStruct device
		decoder := gob.NewDecoder(&mss)
		decoder.Decode(&mss)
		fmt.Println(mss)
		//	fmt.Printf("%+v", *receivedPayload)
		db.AutoMigrate(&device{})
		//db.Select("id", "status").Create(receivedPayload)

	}
)
var connectLostHandler mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	//client = mqtt.ClientOptions{}
	log.Println("connect lost ", err)
}

func main() {
	fmt.Println("Welcome to my project")
	//Database o day
	dsn := "host=localhost user=nhattoan password=test123 dbname=iot_dms port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("Cannot connect to Database")
		fmt.Println("Cannot connect to Database")
	} else {
		log.Println("Success open Database")
	}
	db.AutoMigrate(&device{})
	if err != nil {
		log.Println("Cannoct ping to Database ", err)
		fmt.Println("Cannot ping Database: ", err)
	} else {
		fmt.Println("Success ping Database")
	}
	//MQTT o day
	//Server
	opts := mqtt.NewClientOptions()
	opts.AddBroker(mqttBroker)
	opts.SetClientID("iot-dms_client_1")
	opts.SetUsername("emqx")
	opts.SetPassword("public")
	opts.SetDefaultPublishHandler(messagePubHandler)
	opts.OnConnect = connectHandler
	opts.OnConnectionLost = connectLostHandler

	//Device
	opts2 := mqtt.NewClientOptions()
	opts2.AddBroker(mqttBroker)
	opts2.SetClientID("iot-dms_device_1")
	opts2.SetUsername("emqx1")
	opts2.SetPassword("public")
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

	datas := device{id: "1234", status: false}
	//fmt.Println(datas)

	sub(client_server, mqttTopic, 1)
	pub(client_device, mqttTopic, 1, datas)
}

func sub(client mqtt.Client, topic string, qos byte) {
	token := client.Subscribe(topic, 1, messagePubHandler)
	token.Wait()
	log.Println("Sucessful subcribing to mqtt Topic")
}
func pub(client mqtt.Client, topic string, qos byte, sendPayload device) {
	//fmt.Println(datas)
	var encodedStruct bytes.Buffer
	encoder := gob.NewEncoder(&encodedStruct)
	encoder.Encode(sendPayload)
	//	fmt.Println(sendPayload)
	token := client.Publish(topic, 1, false, encodedStruct)
	token.Wait()
	time.Sleep(time.Second)
	log.Println("Sucessful publishing to mqtt Topic")
}
