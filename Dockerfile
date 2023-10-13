FROM golang:latest

RUN mkdir app

ADD . /app

WORKDIR /app

RUN go mod init github.com/decalnguyen/DevopsforIOT

RUN go mod tidy

#RUN go build -o app

CMD ["go", "run", "main.go"]

EXPOSE 8080