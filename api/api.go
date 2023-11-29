package main

import (
	
    "encoding/json"
    "log"
    "net/http"
    "gorm.io/driver/postgres"
	"gorm.io/gorm"
    "github.com/gin-gonic/gin"

)

func getDevices(db *gorm.db, w http.ResponseWriter, r *http.Request)
{
    result, err := db.Query("SELECT id, name, location, status, createat, updateat, deleteat FROM devices")
    if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
    }
    defer result.Close()
    var devices []Device
    for result.Next() {
        var u Device
        if err := result.Scan(&u.id, &u.name, &u.location, &u.status, &u.CreateAt, &u.UpdateAt, &u.DeletedAt); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        devices = append(devices, u)
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(devices)
}
func main(){
	dsn = "host=postgres user=nhattoan password=test123 dbname=iot_dms port=5432 sslmode=disable"
    db, err := gorm.Open(dsn)
    http.HandleFunc("/devices", func(w http.ResponseWriter, r *http.Request)
    {
        if r.Method == "GET" { 
            getUsers(db, w, r)
        }
    })
    log.Writeln(err)
    log.Fatal(http.ListenAndServe(":8081", nil))
    
}

