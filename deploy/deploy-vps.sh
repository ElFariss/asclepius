#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/asclepius}"
BRANCH="${BRANCH:-main}"
WEB_PORT="${WEB_PORT:-8088}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

cd "$APP_DIR"

git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

docker compose -f "$COMPOSE_FILE" build
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

curl -fsS "http://127.0.0.1:${WEB_PORT}/health" >/dev/null
echo "asclepius deploy healthy on port ${WEB_PORT}"
