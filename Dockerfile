FROM golang:latest as builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o build .

FROM alpine

WORKDIR /app

COPY --from=builder /app/build .

ENTRYPOINT ["ls","-l"]