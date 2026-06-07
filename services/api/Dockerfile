FROM golang:1.25-alpine AS build

WORKDIR /src

COPY services/api/go.mod services/api/go.sum ./
RUN go mod download

COPY services/api ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/asclepius-api ./cmd/server

FROM alpine:3.22

RUN apk add --no-cache ca-certificates \
  && adduser -D -h /app asclepius

WORKDIR /app

COPY --from=build /out/asclepius-api /usr/local/bin/asclepius-api
COPY services/api/migrations ./migrations

RUN mkdir -p /app/storage \
  && chown -R asclepius:asclepius /app

USER asclepius

ENV PORT=8080
ENV STORAGE_DIR=/app/storage

EXPOSE 8080

CMD ["asclepius-api"]
