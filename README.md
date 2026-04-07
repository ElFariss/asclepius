# Asclepius

Asclepius is an AI-powered pre-operative monitoring platform built as a monorepo.

## Workspace

- `apps/web`: Vue 3 frontend for patient and doctor experiences
- `services/api`: Go API scaffold reserved for later phases
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
│   ├── api/                      # Go placeholder only in phase one
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
npm run dev
npm run build
npm run test
npm run lint
```

The phase-one frontend uses mocked gateway adapters so flows can be validated before the Go and Python services are implemented.
