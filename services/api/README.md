# Go API

This service now backs the Vue app with a real PostgreSQL data layer.

## Responsibilities

- Account registration and login
- Bearer-token session storage
- Patient and doctor profile/settings data
- Pending care plan creation
- Patient and doctor dashboard data
- Patient checklist, diet, medicines, sleep, and calendar reads
- Doctor calendar event creation and surgery decision updates
- Local avatar and surgery-document storage

## Local development

1. Start PostgreSQL from the repo root with `npm run db:up`
2. Start the API with `npm run dev:api`
3. Start the frontend with `npm run dev`

## Defaults

- API base URL: `http://localhost:8080`
- PostgreSQL URL: `postgres://postgres:postgres@localhost:5432/asclepius?sslmode=disable`
- Seeded doctor login: `dr.andi@hospital.com / password123`
- Seeded patient login: `patient@example.com / password123`
