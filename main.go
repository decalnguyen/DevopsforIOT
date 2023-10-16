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
	CreateAt time.Time `gorm:"->;<-:create"`
	UpdateAt time.Time `gorm:"<-"`
	id       uint      `gorm:"primaryKey<-:create"`
	name     string    `gorm:"<-:create"`
	status   bool      `gorm:"<-"`
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
		var decodedMess device
		mss := message.Payload()
		//decoder := json.NewDecoder(strings.NewReader(mss))
		//decoder.DisallowUnknownFields()
		json.Unmarshal(mss, &decodedMess)
		fmt.Println(decodedMess)
		//fmt.Println(1)
		db.AutoMigrate(&device{})
		//db.Select("id", "name", "status", "createat", "updateat").Create(decodedMess)

	}
)
var connectLostHandler mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	log.Println("connect lost ", err)
}

func sub(client mqtt.Client, topic string, qos byte) {
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Println("Error connecting to MQTT broker: ", token.Error())
	} else {
		log.Println("Server connected succesfully to MQTT Broker")
	}
	fmt.Println(client.IsConnected())
	token := client.Subscribe(topic, qos, messagePubHandler)
	token.Wait()
	log.Println("Sucessful subcribing to mqtt Topic")
}
func pub(client mqtt.Client, topic string, qos byte, sendPayload device) {
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Println("Error connecting to MQTT broker: ", token.Error())
	} else {
		log.Println("Device connected successfully to MQTT Broker")
	}
	fmt.Println(client.IsConnected())
	encodedMes, err := json.Marshal(sendPayload)
	fmt.Println("Marshal error ", err)
	//	fmt.Println(encodedMes)
	token := client.Publish(topic, qos, false, encodedMes)
	token.Wait()
	time.Sleep(time.Second)
	log.Println("Sucessful publishing to mqtt Topic")
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
	client_server := mqtt.NewClient(opts)
	client_device := mqtt.NewClient(opts2)
	datas := device{CreateAt: time.Now(), UpdateAt: time.Now(), id: 1234, name: "camera", status: false}
	sub(client_server, mqttTopic, 1)
	pub(client_device, mqttTopic, 1, datas)
}
