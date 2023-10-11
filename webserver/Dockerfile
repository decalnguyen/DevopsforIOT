FROM golang:latest

RUN mkdir app

COPY . /app

RUN go mod tidy

WORKDIR /app

RUN go build -o app

CMD ["main.go"]

EXPOSE 8080