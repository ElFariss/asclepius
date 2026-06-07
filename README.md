# Asclepius

Asclepius is an AI-powered pre-operative monitoring platform built as a Vue + Go + PostgreSQL monorepo.

## Workspace

- `apps/web`: Vue 3 frontend for patient and doctor experiences
- `services/api`: Go REST API with PostgreSQL persistence, seeded demo workspace, uploaded assets, chat, risk scoring, and calendar data
- `services/ai`: Python AI scaffold reserved for later phases
- `docs`: product architecture, route map, and backend handoff notes

## Codebase structure

```

├── apps/
│   └── web/
│       ├── public/
│       ├── src/
│       │   ├── app/              # bootstrap, router, layouts, guards
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── patient/
│       │   │   ├── doctor/
│       │   │   └── shared/
│       │   ├── components/       # primitives, charts, nav, form controls
│       │   ├── stores/           # Pinia stores
│       │   ├── services/         # gateway interfaces, mock adapters, fixtures
│       │   ├── types/            # domain/view models
│       │   └── styles/           # Tailwind entry, tokens, utilities
│       ├── package.json
│       └── vite.config.ts
├── services/
│   ├── api/                      # Go API, migrations, seeds, local asset storage
│   └── ai/                       # Python placeholder only in phase one
├── docs/                         # IA, screen map, backend handoff notes
├── package.json                  # npm workspaces root
└── README.md

```


## Frontend stack

- Vue 3
- Vue Router
- Pinia
- Tailwind CSS 4
- Vue ECharts
- Vitest

## Scripts

From the repo root:

```bash
npm install
npm run db:up
npm run dev:api
npm run dev
npm run build
npm run test
npm run lint
```

The frontend uses same-origin `/api` and `/assets` by default. In local development, Vite proxies those paths to `http://localhost:8080`, so start both PostgreSQL and the Go API before logging in or registering.

## Demo Mode

Normal login/register uses the live workspace and starts empty. The public `/landing` page has a `Demo` button that creates an isolated doctor or patient demo session backed by seeded demo data. Demo writes stay in the demo workspace.

## Production

Production deployment is prepared with Docker Compose:

```bash
cp .env.production.example .env.production
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
curl http://127.0.0.1:8088/health
```

The production stack serves the Vue app through Nginx and proxies `/api` and `/assets` to the Go API. PostgreSQL and uploaded assets use persistent Docker volumes.

GitHub Actions includes CI on push/PR and a VPS deploy workflow. The deploy workflow is gated: it only runs automatically on `main` when the repository variable `DEPLOY_APPROVED` is set to `true`, or manually through `workflow_dispatch`.
