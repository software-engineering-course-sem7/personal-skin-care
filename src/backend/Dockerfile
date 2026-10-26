FROM golang:1.25.0-alpine3.22 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main ./cmd/server

FROM alpine:3.22.7

WORKDIR /app

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
