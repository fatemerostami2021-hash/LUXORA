# LUXORA Backend (independent of the frontend)
Express + TypeScript + Prisma + PostgreSQL 16 (Docker). Upgrade it on its own: change versions in package.json, or the image tag in docker-compose.yml.

    cp .env.example .env          # edit the password
    npm install
    npm run db:up                 # starts PostgreSQL in Docker
    npm run db:migrate -- --name init
    npm run db:seed
    npm run dev                   # http://localhost:4000/health

Endpoints (v1): GET /health, /api/v1/brands, /api/v1/products?locale=fa&region=AE&brand=&category=&page=&limit=, /api/v1/products/:slug
Rules: prices exist per region (no auto conversion); a product is sold in a region only when it has a price row there. Seed data is demo only, no prices.
Not built yet: auth, cart, checkout, orders, admin, payments, audit logs.
