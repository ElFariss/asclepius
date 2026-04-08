package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/asclepius/services/api/internal/api"
)

func envOrDefault(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func main() {
	workDir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	config := api.Config{
		DatabaseURL:   envOrDefault("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/asclepius?sslmode=disable"),
		Port:          envOrDefault("PORT", "8080"),
		CORSOrigin:    envOrDefault("CORS_ORIGIN", "http://localhost:3000"),
		StorageDir:    filepath.Join(workDir, "storage"),
		PublicBaseURL: envOrDefault("PUBLIC_BASE_URL", "http://localhost:8080"),
		WorkDir:       workDir,
	}

	server, err := api.NewServer(config)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("api listening on :%s", config.Port)
	log.Fatal(http.ListenAndServe(":"+config.Port, server.Handler()))
}
