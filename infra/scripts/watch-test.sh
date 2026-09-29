#!/usr/bin/env bash
#
# Roda o Jest em modo watch sobre UM arquivo de teste, garantindo a infra:
#  - Postgres e migrações: idempotentes (services:up / migrations:up)
#  - next dev: sobe só se a porta 3000 ainda não estiver atendendo, e
#    é encerrado junto quando o watch termina (Ctrl+C).
#
# Uso:
#   npm run test:watch:file -- tests/integration/api/v1/user/get.test.js
#
set -euo pipefail

TEST_PATH="${1:-}"
if [ -z "$TEST_PATH" ]; then
  echo "uso: npm run test:watch:file -- <caminho-do-teste>" >&2
  exit 1
fi

port_is_open() {
  (exec 3<>"/dev/tcp/127.0.0.1/3000") 2>/dev/null
}

npm run services:up
npm run services:wait:database
npm run migrations:up

NEXT_PID=""

if port_is_open; then
  echo "app já no ar na porta 3000 — reaproveitando"
else
  echo "subindo next dev na porta 3000"
  npx next dev -p 3000 &
  NEXT_PID=$!
  trap 'if [ -n "$NEXT_PID" ]; then kill "$NEXT_PID" 2>/dev/null || true; fi' EXIT INT TERM

  for _ in $(seq 1 60); do
    port_is_open && break
    sleep 0.5
  done
fi

npx jest --colors --watchAll --runInBand --verbose "$TEST_PATH"
