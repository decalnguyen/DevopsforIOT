package main

import (
	"encoding/json"
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
	gorm.Model
	id     string
	status bool
}

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
		dsn := "host=localhost user=nhattoan password=test123 dbname=iot_dms port=5432 sslmode=disable"
		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Println("Cannot open Database")

		} else {
			log.Println("Successful openning database")
		}
		mss := message.Payload()
		var receivedPayload device
		json.Unmarshal(mss, &receivedPayload)
		db.Create(receivedPayload)
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

	datas := device{id: "1234", status: false}

	sub(client_server, mqttTopic, 2)
	pub(client_device, mqttTopic, 2, datas)
}

func pub(client mqtt.Client, topic string, qos byte, datas device) {
	token := client.Publish(topic, qos, false, datas)
	token.Wait()
	time.Sleep(time.Second)
	if token.Error != nil {
		log.Println("Cannot publishing to mqtt Topic")
	} else {
		log.Println("Sucessful publishing to mqtt Topic")
	}
}

func sub(client mqtt.Client, topic string, qos byte) {
	token := client.Subscribe(topic, qos, messagePubHandler)
	token.Wait()

	if token.Error != nil {
		log.Println("Cannot subcribing to mqtt Topic ", token.Error)
	} else {
		log.Println("Sucessful subcribing to mqtt Topic")
	}

	log.Println("Sucessful subcribing to mqtt Topic")

}
