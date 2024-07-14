package main

import (
	//"bytes"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
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

var db *gorm.DB
var (
	deviceLastSeen = make(map[string]time.Time)
)

const (
	mqttBroker    = "tcp://emqx:1883"
	mqttTopicSub  = "nckh/temperature"
	mqttTopicSub2 = "nckh/humidity"
	mqttTopicSub3 = "nckh/atmosphere"
	mqttTopicSub4 = "nckh/listdevices"
	mqttConfig    = "nckh/config"
	mqttConsumed  = "nckh/consumed"
	url           = "https://api.telegram.org/bot7328130688:AAES6kUd0FQKkVOH7YIs9H_zq3_E4-029qI/sendMessage"
	checkInterval = 10 * time.Second
	deviceTimeout = 30 * time.Second
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

func PersistDevicesInfo(device *Device) {
	if CheckExists(device) == true {
		log.Println("Persist devices")
		db.AutoMigrate(&Device{})
		db.Select("device_id", "device_type", "location").Create(&device)
	}

}

func (s *serverMetric) HandleElecCon(message []string) {
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

func CheckExists(device *Device) bool {
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
func (s *serverMetric) initProm() {
	topics := s.getstoreTopic()
	for i := 0; i < len(topics); i++ {
		temp := string(topics[i])
		log.Println(temp)
		sub(s.client, temp, 1)
	}
	prometheus.MustRegister(iotData)
	prometheus.MustRegister(listDevices)
	prometheus.MustRegister(powerConsumed)
}
func (s *serverMetric) getstoreTopic() []string {
	var topics []TopicSub
	db.Find(&topics)
	temp := make([]string, len(topics)+1)
	for i, topic := range topics {
		temp[i] = topic.Topic
	}
	return temp
}
func (s *serverMetric) processDataProme(payload []byte, topic string) {
	input := string(payload)
	parts := strings.Split(input, ":")
	log.Println(topic)
	if topic == mqttConsumed {
		s.HandleElecCon(parts)
	} else if topic == mqttConfig {
		if parts[0] == "delete" {
			s.HandleDeleteDevices(parts[1])
		} else if parts[0] == "create" {
			s.HandleAddDevices(parts)
		}
	} else if len(parts) == 5 {
		s.HandleDataDevices(parts)
	} else {
		log.Println("Recieved a wrong format message")
	}

}

func (s *serverMetric) HandleDeleteDevices(topic string) {
	s.client.Unsubscribe(topic)
	result := db.Where("topic = ?", topic).Delete(&TopicSub{Topic: topic})
	log.Println(result.Error)
}
func (s *serverMetric) HandleAddDevices(message []string) {
	sub(s.client, message[1], 1)
	db.AutoMigrate(&TopicSub{})
	db.Create(&TopicSub{Device_id: message[2], Topic: message[1]})
	if len(message) > 3 {
		status := &Device{Device_id: message[2], Device_type: message[3], Location: message[4]}
		PersistDevicesInfo(status)
	}

}
func (s *serverMetric) HandleStatusDevices(message []string) {
	if message[4] == "on" {
		listDevices.With(prometheus.Labels{"device_id": message[0], "typeofdevice": message[1], "location": message[2]}).Set(1)
	} else {
		listDevices.With(prometheus.Labels{"device_id": message[0], "typeofdevice": message[1], "location": message[2]}).Set(0)
	}

}
func (s *serverMetric) HandleDataDevices(message []string) {
	floatValue, err := strconv.ParseFloat(message[3], 64)
	log.Println("ParseFloat error", err)
	iotData.With(prometheus.Labels{"device_id": message[0], "metric": message[1]}).Set(floatValue)
	deviceLastSeen[message[0]] = time.Now()
	s.HandleStatusDevices(message)
}
func (s *serverMetric) CheckDeviceStatus() {
	for {
		time.Sleep(checkInterval)
		now := time.Now()
		for deviceID, lastSeen := range deviceLastSeen {
			if now.Sub(lastSeen) > deviceTimeout {
				mes := "Device is offline" + deviceID
				message := &Message{ChatID: 1565755457, Text: string(mes)}
				s.HandleSendNoti(url, message)
				//delete(deviceLastSeen, deviceID)
			}
		}
	}
}
func (s *serverMetric) HandleSendNoti(urll string, message *Message) bool {

	payload, _ := json.Marshal(message)

	response, _ := http.Post(urll, "application/json", bytes.NewBuffer(payload))

	log.Println(response)
	defer func(body io.ReadCloser) {
		if err := body.Close(); err != nil {
			log.Println("failed to close response body")
		}
	}(response.Body)
	if response.StatusCode != http.StatusOK {
		return false
	}
	return false
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

var (
	messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, message mqtt.Message) {
		/*dsn := "host=postgres user=nhattoan password=test123 dbname=iot_dms port=5432 sslmode=disable"
		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Println("Cannot open Database", err)

		} else {
			log.Println("Successful openning database")
		}*/
		//Server*/
		//var decodedMess Deviceopts.SetUsername(user)
		//.SetPassword(pass)
		/*	db.AutoMigrate(&Device{})
			db.Select("createat", "updateat", "deleteat", "id", "name", "status", "location").Create(&decodedMess)*/
		HandleMessage(client, message)
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
	db1, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("Connect database fail")
	} else {
		log.Println("Connect database succesfully")
	}
	db = db1
	client_server := InitalizeClientMQTT("iot_dms_server_1", "server", "Server1,")
	server.client = client_server
	sub(server.client, mqttTopicSub, 1)
	sub(server.client, mqttTopicSub2, 1)
	sub(server.client, mqttTopicSub3, 1)
	sub(server.client, mqttTopicSub4, 1)
	sub(server.client, mqttConfig, 1)
	server.initProm()
	//server := NewAPIServer(":8081")
	//server.Run()
	go server.CheckDeviceStatus()
	server.Run()
	// message := &Message{ChatID: 1565755457, Text: string("Device is offline")}
	// server.HandleSendNoti(url, message)
	select {}
}
