package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"strconv"
	"time"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

type Device struct {
	//gorm.Model
	Device_id   string `json:"id"`
	Device_type string
	Location    string
}
type serverMetric struct {
	client mqtt.Client
}
type Message struct {
	ChatID int64  `json:"chat_id"`
	Text   string `json:"text"`
}
type TopicSub struct {
	gorm.Model
	Device_id string
	Topic     string
}
type ElectricConsumption struct {
	gorm.Model
	Device_id   string `gorm:"index"`
	Consumption float64
	Location    string
}
type MessageSimulate struct{
	Device_id string 
	Device_type string 
	Location string 
	Value int
	Status string 
}
func run() {
	opts := mqtt.NewClientOptions()
	opts.AddBroker("tcp://emqx:1883")
	opts.SetClientID("go_mqtt_client")
	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Println("failed to connect to MQTT broker: %v", token.Error())
	}

	var device1 []Device
	result := db.Find(&device1)
	if result.Error != nil {
		log.Println(result.Error)
	}
	for _, value := range device1 {
		var topic1 []TopicSub
		result := db.Where("device_id = ?", value.Device_id).Find(&topic1)
		if result.Error != nil {
			log.Println(result.Error)
		}
		randomValue := rand.Intn(8) + 33
		log.Println(randomValue)
		for _, value1 := range topic1 {
			//var mess1 string
			t := strconv.Itoa(randomValue)
			message := fmt.Sprintf("%s:%s:%s:%s:on",
			value.Device_id, value.Device_type,value.Location, t)
			//mess1 = string(value.Device_id) +":"+string(value.Device_type)+":"+string(value.Location)+":"+t+":on" 
			log.Println(message)
			encodedMes, err := json.Marshal(message)
			fmt.Println("Marshal error ", err)
			client.Publish(value1.Topic, 1, false, encodedMes)
		}
	}
}
func persist() {
	opts := mqtt.NewClientOptions()
	opts.AddBroker("tcp://emqx:1883")
	opts.SetClientID("go_mqtt_client")
	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Println("failed to connect to MQTT broker: %v", token.Error())
	}
	dsn := "host=postgres user=nhattoan password=test123 dbname=iot_dms port=5432 sslmode=disable"
	db1, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("Connect database fail")
	} else {
		log.Println("Connect database successfully")
	}
	db = db1
	//temp := 0
	temp2 := 0 
	arr := []string {"humidity","temperature","gas"}
	//var mess string
	for fl:=1;fl<=4;fl++{
		for j:=1;j<=12;j++{
			temp5 := strconv.Itoa(j)
			temp4 := strconv.Itoa(fl)
			for i:=0;i<3;i++{
				time.Sleep(1 * time.Second)
				mess := "create:nckh/sensor/buildinge/floor" + temp5 +"/room" + temp5 + "." + temp4 + "/"
				temp2 ++
				temp3 := strconv.Itoa(temp2)
				mess += arr[i] + ":" + "device" + temp3 + ":" + arr[i] + ":floor" + temp5 +"/room" +temp5 + "." + temp4 
				log.Println(mess)
				encodedMes, err := json.Marshal(mess)
				fmt.Println("Marshal error ", err)
				client.Publish("nckh/config", 1, false, encodedMes)
			}
		}
	}
}
func main() {
	for {
		time.Sleep(2 * time.Second) // Check every 30 seconds
		// Add logic here to check if devices are offline and send a message
		//persist()
		run()
	}
	//persist()
	//run()
}
