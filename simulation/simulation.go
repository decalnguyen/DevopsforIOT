package simulation

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"

	"github/decalnguyen/DevopsforIOT/table"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func run() {
	dsn := "host=postgres user=nhattoan password=test123 dbname=iot_dms port=5432 sslmode=disable"
	db1, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("Connect database fail")
	} else {
		log.Println("Connect database successfully")
	}
	db = db1
	opts := mqtt.NewClientOptions()
	opts.AddBroker("tcp://emqx:1883")
	opts.SetClientID("go_mqtt_client")
	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Println("failed to connect to MQTT broker: %v", token.Error())
	}

	var device1 []table.Device
	result := db.Find(&device1)
	if result.Error != nil {
		log.Println(result.Error)
	}
	for _, value := range device1 {
		var topic1 []table.TopicSub
		result := db.Where("device_id = ?", value).Find(&topic1)
		if result.Error != nil {
			log.Println(result.Error)
		}
		randomValue := rand.Intn(8) + 33
		encodedMes, err := json.Marshal(randomValue)
		fmt.Println("Marshal error ", err)
		for _, value1 := range topic1 {
			client.Publish(value1.Topic, 1, false, encodedMes)
		}
	}
}
func main() {
	run()
}
