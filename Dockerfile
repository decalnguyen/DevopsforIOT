FROM golang:latest

RUN mkdir app

ADD . /app

RUN go get github.com/eclipse/paho.mqtt.golang

RUN go mod init 

RUN go mod tidy

WORKDIR /app

RUN go build -o app

CMD ["main.go"]

EXPOSE 8080