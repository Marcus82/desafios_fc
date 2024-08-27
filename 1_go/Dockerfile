# Build Stage
FROM golang:1.18 as build-stage

WORKDIR /app

COPY go.mod .
COPY main.go .

RUN go build -ldflags="-s -w" -o go-app .

# Final Stage 
FROM hello-world

WORKDIR /usr/src/app/

COPY --from=build-stage /app/go-app .

ENTRYPOINT [ "./go-app" ]
