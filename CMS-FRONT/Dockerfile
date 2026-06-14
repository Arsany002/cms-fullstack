# ─────────────────────────────────────────────────────────────────────────────
# CMS Frontend – multi-stage Dockerfile
#
# Stages:
#   deps        → install npm dependencies (shared by dev & prod)
#   development → Vite dev server with HMR (used by docker-compose.override.yml)
#   build       → compile production assets
#   production  → Nginx serving the compiled SPA (default)
# ─────────────────────────────────────────────────────────────────────────────

# ─── Stage 1: Install dependencies ──────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
# --ignore-scripts prevents arbitrary postinstall hooks from running in CI/CD
RUN npm ci --ignore-scripts

# ─── Stage 2: Development (Vite HMR) ────────────────────────────────────────
FROM deps AS development
WORKDIR /app

# Source is volume-mounted at runtime; node_modules come from the deps stage.
# The CMD below is overridden in docker-compose.override.yml if needed.
EXPOSE 5173
COPY . .
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ─── Stage 3: Production build ───────────────────────────────────────────────
FROM deps AS build
WORKDIR /app

# Copy full source (node_modules already present from deps stage)
COPY . .

# VITE_API_BASE_URL is baked into the JS bundle at build time.
# The docker-compose.yml passes /api/v1 (relative) so it works behind the proxy
# on any domain without rebuilding.
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ─── Stage 4: Production image (Nginx) ───────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# SPA-aware Nginx config (serves index.html for all unknown paths)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
