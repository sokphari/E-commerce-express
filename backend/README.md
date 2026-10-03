# PhoneHub Backend

PhoneHub is a backend-first REST API for a phone and accessories e-commerce platform. It supports customer authentication, admin catalog management, product variants, addresses, cart, checkout, orders, payments, inventory movement records, wishlist, reviews, Swagger documentation, automated tests, and Docker local setup.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT authentication
- bcrypt password hashing
- Zod validation
- Swagger / OpenAPI
- Jest and Supertest
- Docker Compose
- Redis

## Requirements

- Node.js 22 or newer
- npm
- PostgreSQL for local non-Docker development
- Docker and Docker Compose for container development

## Environment Setup

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Important local values:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=phonehub_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me
CLIENT_URL=http://localhost:5173
```

For Docker, the Compose file already provides development environment values and connects the backend to the PostgreSQL container.

## Run Locally

Install dependencies:

```bash
npm install
```

Run database migrations:

```bash
npm run migrate
```

Start development server:

```bash
npm run dev
```

Start normal server:

```bash
npm start
```

The backend runs at:

```http
http://localhost:5000
```

## Run With Docker

Start backend and PostgreSQL:

```bash
npm run docker:up
```

Docker behavior:

- Backend runs on `http://localhost:5000`
- PostgreSQL runs in Docker and is exposed locally on port `5433`
- Redis runs in Docker and is exposed locally on port `6379`
- Backend waits for PostgreSQL to be healthy
- Migrations run automatically before the backend starts

Watch backend logs:

```bash
npm run docker:logs
```

Stop Docker services:

```bash
npm run docker:down
```

Create an admin user inside Docker after the stack is running:

```bash
docker compose exec backend npm run create-admin -- --email=admin@example.com --password=Password123
```

## Create Admin Locally

After local migrations are complete:

```bash
npm run create-admin -- --email=admin@example.com --password=Password123
```

Use that admin account to call protected admin endpoints.

## API Documentation

Swagger UI:

```http
http://localhost:5000/api-docs
```

OpenAPI JSON:

```http
http://localhost:5000/api-docs.json
```

Admin endpoints show a lock icon in Swagger because they require a Bearer token from an admin login.

## Main API Modules

Public and customer modules:

- Auth: register, login, refresh token, logout
- Profile: current user profile
- Brands: list and detail
- Categories: list and detail
- Products: list, detail, search, filters
- Product variants: variant data for products
- Addresses: customer shipping addresses
- Cart: add, update, remove, view cart items
- Checkout: create order from cart
- Orders: customer order history and details
- Wishlist: save products for later
- Reviews: product reviews from customers

Admin modules:

- Admin auth
- Brand management
- Category management
- Product management
- Product variant management
- Order management
- Payment records
- Inventory movement records
- Review moderation

## Common API URLs

```http
GET /api/v1/health
GET /api/v1/products
GET /api/v1/products/{slug}
GET /api/v1/categories
GET /api/v1/brands
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/admin/login
```

Protected requests need this header:

```http
Authorization: Bearer <access_token>
```

## Redis

Redis is configured for fast temporary data. The first implemented use is auth rate limiting for register, login, and refresh token requests.

Local Redis environment values:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379
```

Docker Compose runs Redis automatically at:

```text
redis://redis:6379
```

Auth rate limit behavior:

- Applies to `POST /api/v1/auth/register`
- Applies to `POST /api/v1/auth/login`
- Applies to `POST /api/v1/auth/refresh`
- Allows 20 attempts per 15 minutes per IP, route, and email when available
- Returns `429 Too Many Requests` after the limit
- Skips rate limiting during automated tests
- Fails open in development if Redis is unavailable

## Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Current automated tests cover the core flow and verify the app can run with the documented API behavior.

## Database

Migrations are stored in:

```text
migrations/
```

Run migrations manually:

```bash
npm run migrate
```

Database schema notes are in:

```text
docs/DATABASE_SCHEMA.md
```

## Useful Scripts

```bash
npm run dev
npm start
npm run migrate
npm run create-admin -- --email=admin@example.com --password=Password123
npm test
npm run docker:up
npm run docker:logs
npm run docker:down
```

## Current Next Step

The next recommended task is adding more automated test coverage for checkout, payments, inventory movements, wishlist, and reviews.
