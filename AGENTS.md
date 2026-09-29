# AGENTS.md

Instruções para agentes e pessoas que precisam **subir**, **derrubar** ou **validar** este projeto.

Clone do TabNews (curso.dev). Next.js com **pages router**, Postgres, Jest para testes de integração.

---

## 1. Pré-requisitos

| Item             | Versão         | Observação                                                                                                                               |
| ---------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Node             | **22.x**       | fixado em `.nvmrc` (`22`) e em `package.json#engines`. O Node padrão da máquina pode ser outro — rode `nvm use` antes de qualquer `npm`. |
| Docker + Compose | v2             | só o Postgres roda em container                                                                                                          |
| Portas livres    | `5432`, `3000` | 5432 pelo container, 3000 pelo app                                                                                                       |

```bash
nvm use            # lê o .nvmrc → Node 22
node -v            # confirme: v22.x
```

## 2. Topologia

**Infra no Docker, app no host.** Não existe `Dockerfile` nem `docker-compose.yml` na raiz — o arquivo de infra é **`infra/compose.yaml`** e só sobe o Postgres:

```
container: postgres-dev   (postgres:16.0-alpine)   host:5432 -> container:5432
volume:    postgres_data  (persistente)
environment: vem de .env.development via env_file
```

Os scripts do `package.json` já passam `-f infra/compose.yaml`, então **não use `docker compose up` puro** na raiz.

`.env.development` é **versionado** e serve a dois consumidores: o container (via `env_file`) e o `next dev` (carregado pelo Next). O `.env` (sem sufixo) está no `.gitignore` — nunca coloque segredos reais em `.env.development`.

## 3. Subir o projeto

### Forma direta (faz tudo)

```bash
npm run dev
```

Expande para: `services:up` → `services:wait:database` → `migrations:up` → `next dev`. O processo fica em foreground na porta 3000.

### Passo a passo (útil para rodar em background / depurar)

```bash
npm run services:up              # sobe o Postgres em Docker
npm run services:wait:database   # espera o Postgres aceitar conexões
npm run migrations:up            # aplica as migrações (idempotente)
npx next dev -p 3000             # sobe o app
```

Para rodar o app em background, rode o último comando como processo separado (ex.: `bash -lc 'nvm use >/dev/null && exec npx next dev -p 3000'`) e guarde o PID. **Não** use `npm run dev` em background: ele mantém a cadeia de scripts viva e dificulta o kill.

### Verificar que subiu

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/            # 200
curl -s http://localhost:3000/api/v1/status                               # 200 + database.version "16.0"
docker ps --format '{{.Names}} {{.Status}}'                               # postgres-dev Up
```

`/api/v1/status` é o health check de verdade: ele confirma que o **app alcança o banco**. Se ele responder 503, o app está no ar mas o Postgres não está.

## 4. Derrubar o projeto

| Objetivo                                    | Comando                                                                 |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| Parar o app                                 | `pkill -f "next[-]server"`                                              |
| Parar os containers (mantém os dados)       | `npm run services:stop`                                                 |
| Remover containers + rede (mantém o volume) | `npm run services:down`                                                 |
| Apagar também os dados                      | `npm run services:down && docker volume rm clone-tabnews_postgres_data` |
| Tudo de uma vez                             | `pkill -f "next[-]server"; npm run services:down`                       |

O `pkill` usa o padrão `next[-]server` com propósito: escrito como `pkill -f "next-server"` o comando **casa com a própria linha de comando do shell que o executa e mata a si mesmo** (exit 143, sem derrubar o app). O `[-]` evita esse auto-match. Não simplifique para `pkill -f "next dev"` pelo mesmo motivo.

## 5. Pegadinhas conhecidas

1. **`npm test` derruba o Postgres no final.** O script tem `posttest: npm run services:stop`, então depois de rodar os testes o banco fica parado e `/api/v1/status` passa a responder **503**. Isso não é regressão — rode `npm run services:up` novamente.
2. **`npm test` sobe um `next dev` próprio** (via `concurrently`) e o encerra ao final. Não rode junto com um `next dev` já ativo: os dois disputam a porta 3000.
3. **Node errado é a falha mais comum.** Sem `nvm use`, o `npm install` roda sob a versão padrão da máquina e emite `EBADENGINE`; builds e o dev server podem se comportar de forma diferente do CI.
4. **Migrações exigem o banco no ar.** `npm run migrations:up` falha se você pular o `services:wait:database`.
5. **`main` é protegida.** Push direto é rejeitado pelo servidor (`Changes must be made through a pull request` + status checks obrigatórios). Sempre: branch → commit → push → PR → CI verde → merge.

## 6. Qualidade antes de commitar

```bash
npm run lint:eslint:check     # next lint --dir .
npm run lint:prettier:check   # prettier --check .
npm run build                 # next build
npm test                      # 7 suites / 17 testes (sobe e derruba o banco)
```

Correção automática: `npm run lint:eslint:fix` e `npm run lint:prettier:fix`. Commit interativo: `npm run commit` (Commitizen).

Commits seguem **Conventional Commits** (`feat`, `fix`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`, `build`), validados pelo Husky via commitlint. Detalhes completos em `.cursorrules`.

## 7. CI

Dois workflows, disparados em `pull_request`:

- `.github/workflows/tests.yaml` → job **Jest Ubuntu** (`npm ci` + `npm test`)
- `.github/workflows/linting.yaml` → jobs **Prettier**, **ESLint**, **CommitLint**

Os 4 usos de `actions/setup-node` apontam para **`node-version-file: ".nvmrc"`**, então o Node do CI é o mesmo do desenvolvimento sem duplicar a versão em dois lugares. Ao mudar a versão do Node, mude **apenas** o `.nvmrc`.

Histórico: até o PR #63 a chave estava escrita **`node-vesion`** (sem o `d`) e o valor era `lts/hydrogen` (Node 18). O typo era silencioso — `setup-node` ignorava a entrada, o pin nunca era aplicado e o job rodava com o Node padrão do runner. Foi por isso que o CI passou verde enquanto o projeto não subia na versão de Node declarada.

O `next lint` também emite um aviso de deprecação no job **ESLint** — ver seção 9.

## 8. Estrutura

```
pages/api/v1/          endpoints (status, users, migrations)
models/                acesso a dados e regras de domínio
infra/                 compose.yaml, database.js, controller.js, errors.js
infra/migrations/      migrações node-pg-migrate
tests/integration/     testes em *.test.js
```

`infra/scripts/wat-for-postgres.js` é o script de espera usado por `services:wait:database` (o nome tem o typo `wat` mesmo).

## 9. Versões que importam

- **Next `15.5.26`** — escolhido sobre o 16.x de propósito: a linha 15.x aceita React 18.3.1 e ESLint 8. Subir para o Next 16 exige React 19, ESLint 9 (flat config) **e** migrar `lint:eslint:check` para a CLI do ESLint, porque o `next lint` foi deprecado e sai na 16.
- `overrides` no `package.json` forçam `nanoid`, `postcss` e `shell-quote` para versões corrigidas em toda a árvore de dependências. Não remova sem rodar `npm audit --omit=dev` depois.
