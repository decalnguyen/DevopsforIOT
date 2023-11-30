package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/gorilla/mux"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	mqttBroker = "tcp://emqx:1883"
	mqttTopic  = "home/device/status"
)

type Device struct {
	//gorm.Model
	CreateAt  time.Time `gorm:"->;<-:create"json:"CreateAt"`
	UpdateAt  time.Time `gorm:"<-"json:"UpdateAt"`
	DeletedAt time.Time `json:"DeleteAt`
	Id        int       `json:"id"`
	Name      string    `gorm:"<-:create"json:"Name"`
	Status    bool      `gorm:"<-"json:"Status"`
	Location  string
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
	var devices Device
	rows := db.Find(&devices)
	return WriteJSON(w, http.StatusOK, rows)
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
var (
	messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, message mqtt.Message) {
		dsn := "host=postgres user=nhattoan password=test123 dbname=iot_dms port=5432 sslmode=disable"
		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Println("Cannot open Database", err)

		} else {
			log.Println("Successful openning database")
		}
		var decodedMess Device
		mss := message.Payload()
		json.Unmarshal(mss, &decodedMess)
		//	fmt.Println(decodedMess.id)
		//	fmt.Println(decodedMess.name)
		//fmt.Println(1)
		db.AutoMigrate(&Device{})
		db.Select("createat", "updateat", "deleteat", "id", "name", "status", "location").Create(&decodedMess)

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
func PersistDevicesInfo(device DeviceRegistration) {
	dsn := "host=postgres user=nhattoan password=test123 dbname=iot_dms port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("Persist devices info fail")
	} else {
		log.Println("Persist succesfully")
	}
	db.AutoMigrate(&DeviceRegistration{})
	db.Select("persistat", "id", "name", "firmwareversion", "ownershipinfo").Create(&device)

}
func main() {
	fmt.Println("Welcome to my project")
	//Database o day
	dsn := "host=postgres user=nhattoan password=test123 dbname=iot_dms port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("Cannot connect to Database")
		fmt.Println("Cannot connect to Database")
	} else {
		log.Println("Success open Database")
	}
	db.AutoMigrate(&Device{})
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
	opts.SetUsername("admin")
	opts.SetPassword("test1234")
	opts.SetDefaultPublishHandler(messagePubHandler)
	opts.OnConnect = connectHandler
	opts.OnConnectionLost = connectLostHandler
	//Device
	opts2 := mqtt.NewClientOptions()
	opts2.AddBroker(mqttBroker)
	opts2.SetClientID("iot-dms_device_1")
	opts2.SetUsername("admin")
	opts2.SetPassword("test1234")
	client_server := mqtt.NewClient(opts)
	client_device := mqtt.NewClient(opts2)
	datas := Device{CreateAt: time.Now(), UpdateAt: time.Now(), DeletedAt: time.Now(), Id: 1234, Name: "camera", Status: true, Location: "Viet Nam"}
	sub(client_server, mqttTopic, 1)
	pub(client_device, mqttTopic, 1, datas)
	for i := 11; i <= 30; i++ {
		datas := Device{CreateAt: time.Now(), UpdateAt: time.Now(), DeletedAt: time.Now(), Id: i, Name: "camera", Status: true, Location: "Viet Nam"}
		info := DeviceRegistration{PersistAt: time.Now(), Id: i, Name: "camera", FirmwareVersion: "esp32", OwnershipInfo: "Nhat Toan", Protocal: "MQTT"}
		pub(client_device, mqttTopic, 1, datas)
		PersistDevicesInfo(info)
	}
	server := NewAPIServer(":8081")
	server.Run()
}
