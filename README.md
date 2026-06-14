# Clinic Management System

Full-stack application: Laravel 13 API backend + React 18 SPA frontend, served behind an Nginx reverse proxy via Docker Compose.

```
Browser → http://localhost
              ├─ /api/*  →  cms_backend   (PHP-FPM + Nginx + Supervisor)
              └─ /*      →  cms_frontend  (React SPA / Nginx)
```

---

## Repository layout

```
CMS/                             ← git root (you are here)
├── docker-compose.yml           ← production stack
├── docker-compose.override.yml  ← dev overrides (auto-applied)
├── .env.example                 ← copy to .env and fill in secrets
├── docker/
│   └── proxy/nginx.conf         ← reverse-proxy Nginx config
├── CMS-BACK/                    ← Laravel backend
│   ├── Dockerfile
│   ├── docker/
│   │   ├── nginx/default.conf
│   │   ├── php/{php.ini,opcache.ini,opcache.dev.ini}
│   │   ├── supervisor/supervisord.conf
│   │   └── entrypoint.sh
│   └── ...
└── CMS-FRONT/                   ← React + Vite frontend
    ├── Dockerfile
    ├── nginx.conf
    └── ...
```

---

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| Docker | 24 |
| Docker Compose plugin | v2.20 |

---

## Quick start (production)

```bash
# 1. Copy env file and fill in secrets
cp .env.example .env
#    → Set APP_KEY, DB_PASSWORD, DB_ROOT_PASSWORD,
#       REDIS_PASSWORD, PASSPORT_CLIENT_ID/SECRET

# 2. Build images and start all services
docker compose up -d --build

# 3. Check everything is running
docker compose ps

# 4. Open in browser
open http://localhost
```

> **First boot only:** the entrypoint runs `php artisan migrate --force` automatically. Passport keys and the personal-access client must be created once — see [Initial setup](#initial-setup) below.

---

## Development mode

The `docker-compose.override.yml` is applied automatically. It:
- Swaps the frontend container for a **Vite dev server** with hot-module replacement.
- Exposes the backend on **port 8000** and the frontend on **port 5173**.
- Disables the proxy (each service gets its own port).
- Turns on `opcache.validate_timestamps` so PHP picks up code changes without restart.

```bash
# Start dev stack (override is automatic)
docker compose up -d --build

# Backend API     →  http://localhost:8000/api/v1
# Frontend (HMR)  →  http://localhost:5173

# Tail logs
docker compose logs -f cms_backend
docker compose logs -f cms_frontend

# Run artisan commands
docker compose exec cms_backend php artisan <command>

# Install a new npm package
docker compose exec cms_frontend npm install <pkg>
```

To run production mode locally (with the proxy) while overrides are present:
```bash
docker compose -f docker-compose.yml up -d --build
```

---

## Initial setup (run once after first boot)

```bash
# Generate Passport encryption keys
docker compose exec cms_backend php artisan passport:keys

# Create the personal-access client (copy the Client ID + Secret printed)
docker compose exec cms_backend php artisan passport:client --personal --name="CMS API"

# Paste the values into .env
PASSPORT_CLIENT_ID=<id>
PASSPORT_CLIENT_SECRET=<secret>

# Restart backend to pick up new env values
docker compose restart cms_backend cms_queue cms_scheduler
```

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `APP_KEY` | *(required)* | Laravel app encryption key |
| `APP_ENV` | `production` | Laravel environment |
| `APP_DEBUG` | `false` | Show detailed errors |
| `APP_URL` | `http://localhost` | Public URL |
| `FRONTEND_URL` | `http://localhost` | CORS allowed origin |
| `PROXY_PORT` | `80` | Host port for the proxy |
| `BACKEND_PORT` | `8000` | Host port for backend (dev) |
| `FRONTEND_PORT` | `5173` | Host port for Vite HMR (dev) |
| `DB_DATABASE` | `cms_clinic` | MySQL database name |
| `DB_USERNAME` | `cms_user` | MySQL username |
| `DB_PASSWORD` | *(required)* | MySQL password |
| `DB_ROOT_PASSWORD` | *(required)* | MySQL root password |
| `REDIS_PASSWORD` | *(required)* | Redis password |
| `PASSPORT_CLIENT_ID` | *(required)* | Passport personal-access client ID |
| `PASSPORT_CLIENT_SECRET` | *(required)* | Passport personal-access client secret |

---

## Useful commands

```bash
# Stop all containers
docker compose down

# Stop and remove volumes (⚠ deletes database data)
docker compose down -v

# View logs for a specific service
docker compose logs -f cms_db

# Open a shell in the backend
docker compose exec cms_backend sh

# Run database migrations
docker compose exec cms_backend php artisan migrate

# Clear all caches
docker compose exec cms_backend php artisan optimize:clear

# Rebuild a single service
docker compose up -d --build cms_frontend
```

---

## Production deployment

1. Set `APP_ENV=production`, `APP_DEBUG=false`.
2. Set `FRONTEND_URL` to your domain (e.g., `https://clinic.example.com`).
3. Set `APP_URL` to the same domain.
4. Put a TLS-terminating load balancer (e.g., Caddy, Traefik, AWS ALB) in front of port 80.
5. Change `PROXY_PORT` to `8080` if the host's port 80 is taken by the TLS terminator.

---

## CORS notes

In **production** (proxy mode), the frontend JS and the API both appear on the same origin (`http://localhost` or your domain). The browser never issues a cross-origin request, so CORS is irrelevant.

In **development** (separate ports), the React dev server (`http://localhost:5173`) calls the backend (`http://localhost:8000`). The backend's `config/cors.php` reads `FRONTEND_URL` from `.env`; the override file sets it to `http://localhost:5173` automatically.
