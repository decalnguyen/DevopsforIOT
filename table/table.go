package table

import (
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"gorm.io/gorm"
)

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
