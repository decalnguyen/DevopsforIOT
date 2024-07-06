package main

import (
	"encoding/json"
	"fmt"
	"log"
	http "net/http"
	"strconv"
	"strings"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	mqttBroker    = "tcp://emqx:1883"
	mqttTopicSub  = "nckh/temperature"
	mqttTopicSub2 = "nckh/humidity"
	mqttTopicSub3 = "nckh/atmosphere"
	mqttTopicSub4 = "nckh/listdevices"
	mqttConfig    = "nckh/config"
	mqttConsumed  = "nckh/consumed"
)

type Device struct {
	//gorm.Model
	Device_id   string `json:"id"`
	Device_type string
	Location    string
}

var server serverMetric
var (
	iotData = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "iot_data_temp",
			Help: "IOT devices temperature data",
		},
		[]string{"device_id", "metric"},
	)
	listDevices = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "iot_device",
			Help: "The number of devices",
		},
		[]string{"device_id", "typeofdevice", "location"},
	)
	powerConsumed = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "Power_Consumed",
			Help: "Electric consumption",
		},
		[]string{"device_id"},
	)
)

type serverMetric struct {
	client mqtt.Client
}
type TopicSub struct {
	Device_id string
	Topic     string
}
type ElectricConsumption struct {
	Device_id   string `gorm:"index"`
	Consumption float64
	Location    string
}
type database struct {
}

func PersistDevicesInfo(device *Device, db *gorm.DB) {
	if CheckExists(device, db) == true {
		log.Println("Persist devices")
		db.AutoMigrate(&Device{})
		db.Select("device_id", "device_type", "location").Create(&device)
	}

}

func (s *serverMetric) HandleElecCon(message []string, db *gorm.DB) {
	var existsMetric ElectricConsumption
	results := db.Where("device_id = ?", message[0]).Last(&existsMetric)
	log.Println(results)
	if results.RowsAffected > 0 {
		value, _ := strconv.ParseFloat(message[1], 64)
		value += existsMetric.Consumption
		db.Model(&existsMetric).Where("device_id = ?", message[0]).Update("consumption", value)
	} else {
		value, _ := strconv.ParseFloat(message[1], 64)
		db.AutoMigrate(&ElectricConsumption{})
		db.Create(&ElectricConsumption{
			Device_id:   message[0],
			Consumption: value,
			Location:    message[2],
		})
	}
}

func CheckExists(device *Device, db *gorm.DB) bool {
	var device1 Device
	exists := db.Where("device_id = ?", device.Device_id).Find(&device1)
	if exists.RowsAffected > 0 {
		log.Println("Device exists", device.Device_id)
		return false
	} else {
		return true
	}

}
func newServer() *serverMetric {
	return &serverMetric{}
}
func (s *serverMetric) Run() {
	http.Handle("/metrics", promhttp.Handler())
	http.ListenAndServe(":2112", nil)
}
func (s *serverMetric) initProm(db *gorm.DB) {
	var topics []TopicSub
	result := db.Find(&topics)
	if result.Error != nil {
		log.Print("Error retrieve mqtt topic", result.Error)
	} else {
		for _, topic := range topics {
			sub(s.client, topic.Topic, 1)
		}
	}
	prometheus.MustRegister(iotData)
	prometheus.MustRegister(listDevices)
	prometheus.MustRegister(powerConsumed)
}
func (s *serverMetric) processDataProme(payload []byte, topic string) {
	dsn := "host=postgres user=nhattoan password=test123 dbname=iot_dms port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("Connect database fail")
	} else {
		log.Println("Connect database succesfully")
	}
	input := string(payload)
	parts := strings.Split(input, ":")
	log.Println(topic)
	if topic == mqttConsumed {
		s.HandleElecCon(parts, db)
	} else if topic == mqttConfig {
		if parts[0] == "delete" {
			s.HandleDeleteDevices(parts[1], db)
		} else if parts[0] == "create" {
			s.HandleAddDevices(parts, db)
		}
	} else if len(parts) == 3 {
		s.HandleDataDevices(parts)
	} else if len(parts) == 4 {
		s.HandleStatusDevices(parts)
	} else {
		log.Println("Recieved a wrong format message")
	}

}

func (s *serverMetric) HandleDeleteDevices(topic string, db *gorm.DB) {
	s.client.Unsubscribe(topic)
	db.Delete(&TopicSub{Topic: topic})
}
func (s *serverMetric) HandleAddDevices(message []string, db *gorm.DB) {
	sub(s.client, message[1], 1)
	db.AutoMigrate(&TopicSub{})
	db.Select("Topic").Create(&TopicSub{Topic: message[1]})
	if len(message) > 2 {
		status := &Device{Device_id: message[2], Device_type: message[3], Location: message[4]}
		PersistDevicesInfo(status, db)
	}

}
func (s *serverMetric) HandleStatusDevices(message []string) {
	if message[3] == "on" {
		listDevices.With(prometheus.Labels{"device_id": message[0], "typeofdevice": message[1], "location": message[2]}).Set(1)
	} else {
		listDevices.With(prometheus.Labels{"device_id": message[0], "typeofdevice": message[1], "location": message[2]}).Set(0)
	}

}
func (s *serverMetric) HandleDataDevices(message []string) {
	floatValue, err := strconv.ParseFloat(message[2], 64)
	log.Println("ParseFloat error", err)
	iotData.With(prometheus.Labels{"device_id": message[0], "metric": message[1]}).Set(floatValue)
}
func (s *serverMetric) AddSubTopic(data string) {
}

type DeviceRegistration struct {
	PersistAt       time.Time
	Id              int    `json:"id"`
	Name            string `gorm:"<-:create"json:"Name"`
	FirmwareVersion string
	OwnershipInfo   string
	Protocal        string
}

func WriteJSON(w http.ResponseWriter, status int, v any) error {
	w.WriteHeader(status)
	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(v)
}

type apiFunc func(http.ResponseWriter, *http.Request) error

type ApiError struct {
	Error string
}

func makeHTTPHandleFunc(f apiFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := f(w, r); err != nil {
			WriteJSON(w, http.StatusBadRequest, ApiError{Error: err.Error()})
		}
	}
}

type APIServer struct {
	listenAddr string
}

func NewAPIServer(listenAddr string) *APIServer {
	return &APIServer{
		listenAddr: listenAddr,
	}
}

func (s *APIServer) Run() {
	router := mux.NewRouter()
	router.HandleFunc("/devices", makeHTTPHandleFunc(s.handleDevices))
	http.ListenAndServe(s.listenAddr, router)
}

func (s *APIServer) handleDevices(w http.ResponseWriter, r *http.Request) error {
	switch r.Method {
	case "GET":
		return s.handleGetDevices(w, r)
	case "POST":
		return s.handleCreateDevices(w, r)
	case "DELETE":
		return s.handleDeleteDevices(w, r)
	}
	return fmt.Errorf("Method not allowed ", r.Method)
}
func (s *APIServer) handleGetDevices(w http.ResponseWriter, r *http.Request) error {

	dsn := "host=postgres user=nhattoan password=test123 dbname=iot_dms port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("Cannot access to database ", err)
	}
	var devices []Device
	db.Find(&devices)
	return WriteJSON(w, http.StatusOK, devices)
}
func (s *APIServer) handleCreateDevices(w http.ResponseWriter, r *http.Request) error {
	return nil
}
func (s *APIServer) handleDeleteDevices(w http.ResponseWriter, r *http.Request) error {
	return nil
}

var (
	connectHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
		log.Println("Connected")
	}
)

func HandleMessage(client mqtt.Client, message mqtt.Message) {
	server.processDataProme(message.Payload(), message.Topic())
}

// var (
// 	messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, message mqtt.Message) {
// 		/*dsn := "host=postgres user=nhattoan password=test123 dbname=iot_dms port=5432 sslmode=disable"
// 		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
// 		if err != nil {
// 			log.Println("Cannot open Database", err)

// 		} else {
// 			log.Println("Successful openning database")
// 		}*/
// 		//Server*/
// 		//var decodedMess Deviceopts.SetUsername(user)
// 		//.SetPassword(pass)
// 		/*	db.AutoMigrate(&Device{})
// 			db.Select("createat", "updateat", "deleteat", "id", "name", "status", "location").Create(&decodedMess)*/
// 		HandleMessage(client, message)
// 	}
// )
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
	token := client.Subscribe(topic, qos, func(client mqtt.Client, message mqtt.Message) {
		HandleMessage(client, message)
	})
	token.Wait()
	log.Println("Sucessful subcribing to mqtt Topic")
}
func pub(client mqtt.Client, topic string, qos byte, sendPayload Device) {
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
func InitalizeClientMQTT(ClientID string, user string, pass string) mqtt.Client {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(mqttBroker)
	opts.SetClientID(ClientID)
	opts.SetUsername(user)
	opts.SetPassword(pass)
	opts.SetDefaultPublishHandler(func(client mqtt.Client, message mqtt.Message) {
	})
	opts.OnConnect = connectHandler
	opts.OnConnectionLost = connectLostHandler
	return mqtt.NewClient(opts)
}
func main() {
	dsn := "host=postgres user=nhattoan password=test123 dbname=iot_dms port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("Connect database fail")
	} else {
		log.Println("Connect database succesfully")
	}
	/*
		db.AutoMigrate(&Device{})
		if err != nil {http.Handle("/metrics", promhttp.Handler())
		http.ListenAndServe(":2112", nil)
		for {
			time.Sleep(1 * time.Second)
		}
		//MQTT o day
		//Server*/

	//Device
	server.initProm(db)
	client_server := InitalizeClientMQTT("iot_dms_server_1", "server", "Server1,")
	server.client = client_server
	sub(server.client, mqttTopicSub, 1)
	sub(server.client, mqttTopicSub2, 1)
	sub(server.client, mqttTopicSub3, 1)
	sub(server.client, mqttTopicSub4, 1)
	sub(server.client, mqttConfig, 1)
	//client_device := mqtt.NewClient(opts2)
	//	datas := Device{CreateAt: time.Now(), UpdateAt: time.Now(), DeletedAt: time.Now(), Id: 1234, Name: "camera", Status: true, Location: "Viet Nam"}
	/*sub(client_server, mqttTopic, 1)
	pub(client_device, mqttTopic, 1, datas)*/
	/*for i := 11; i <= 30; i++ {
		datas := Device{CreateAt: time.Now(), UpdateAt: time.Now(), DeletedAt: time.Now(), Id: i, Name: "camera", Status: true, Location: "Viet Nam"}
		info := DeviceRegistration{PersistAt: time.Now(), Id: i, Name: "camera", FirmwareVersion: "esp32", OwnershipInfo: "Nhat Toan", Protocal: "MQTT"}
		pub(client_device, mqttTopic, 1, datas)
		PersistDevicesInfo(info)
	}*/
	//server := NewAPIServer(":8081")
	//server.Run()
	server.Run()
	for {
		time.Sleep(1 * time.Second)
	}
}
