# PhoneHub Backend Progress

This file explains what has already been completed so teammates can quickly understand the current project state.

## Project Scope Read

We reviewed `PHONEHUB_PROJECT_SCOPE.md`.

PhoneHub is planned as a production-style e-commerce REST API for phones and accessories.

Main backend stack:

- Node.js
- Express.js
- PostgreSQL
- `pg`
- JWT
- bcrypt
- Zod
- Redis later
- Swagger later
- Docker later

The project should follow this structure:

- routes
- controllers
- services
- repositories
- middleware
- validators
- utils
- migrations

## Backend Foundation Completed

Basic Express backend foundation has been created.

Completed files:

- `server.js`
- `src/app.js`
- `src/config/env.js`
- `src/config/database.js`
- `src/routes/health.routes.js`
- `src/middleware/not-found.middleware.js`
- `src/middleware/error.middleware.js`
- `.env.example`
- `.gitignore`

Current foundation features:

- Express app setup
- JSON request parsing
- Helmet security headers
- CORS setup
- Morgan request logging
- Central 404 handler
- Central error handler
- PostgreSQL pool config
- Environment config wrapper

Available health endpoints:

```http
GET /
GET /api/v1/health
GET /api/v1/health/db
```

## Database Schema Completed

Initial PostgreSQL schema and migration runner have been created.

Completed files:

- `migrations/001_initial_schema.sql`
- `scripts/migrate.js`
- `docs/DATABASE_SCHEMA.md`

Package script added:

```bash
npm run migrate
```

Migration was successfully applied to PostgreSQL.

Created tables:

- `users`
- `refresh_tokens`
- `addresses`
- `brands`
- `categories`
- `products`
- `product_variants`
- `product_images`
- `product_specifications`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `payments`
- `inventory_movements`
- `schema_migrations`

Important database decisions:

- UUID primary keys are used.
- Money fields use `NUMERIC(12,2)`.
- Timestamps use `TIMESTAMPTZ`.
- User roles use `ADMIN` and `CUSTOMER`.
- Product stock belongs to `product_variants`, not `products`.
- Order items store product snapshots for historical accuracy.
- Refresh tokens are stored as hashes, not raw tokens.

## Authentication Completed

Authentication module has been implemented.

Completed files:

- `src/routes/auth.routes.js`
- `src/controllers/auth.controller.js`
- `src/services/auth.service.js`
- `src/repositories/user.repository.js`
- `src/repositories/refresh-token.repository.js`
- `src/validators/auth.validator.js`
- `src/middleware/auth.middleware.js`
- `src/middleware/validate.middleware.js`
- `src/utils/api-error.js`
- `src/utils/password.js`
- `src/utils/jwt.js`
- `src/utils/user.js`
- `src/controllers/user.controller.js`
- `src/routes/user.routes.js`

Available auth endpoints:

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/users/me
```

Authentication features:

- Customer registration
- Login
- bcrypt password hashing
- JWT access tokens
- JWT refresh tokens
- Refresh token rotation
- Logout by revoking refresh token
- Protected route middleware
- Role authorization helper
- Zod request validation
- Safe user response without `password_hash`

Security notes:

- Passwords are never stored as plain text.
- Password hashes are never returned in API responses.
- Refresh tokens are stored as SHA-256 hashes.
- JWTs include a random `jti` so tokens stay unique even when generated quickly.
- In production, real secrets must be set in `.env`.

Required `.env` values:

```env
JWT_ACCESS_SECRET=your_real_access_secret
JWT_REFRESH_SECRET=your_real_refresh_secret
```

## Verification Already Done

The following checks passed:

- App loads successfully.
- Database migration runs successfully.
- Running migration again skips already-applied migration.
- Register endpoint works.
- Login endpoint works.
- Protected `GET /api/v1/users/me` works with Bearer token.
- Refresh token endpoint works.
- Logout endpoint works.
- Temporary auth test users were cleaned up.

## Authorization and Admin Setup Completed

Admin role protection has been added.

Completed files:

- `src/routes/admin.routes.js`
- `src/controllers/admin.controller.js`
- `scripts/create-admin.js`

Updated files:

- `src/app.js`
- `package.json`
- `.env.example`

Available admin test endpoint:

```http
GET /api/v1/admin/me
```

This endpoint requires:

- Valid Bearer access token
- User role must be `ADMIN`
- User status must be `ACTIVE`

Admin creation command:

```bash
npm run create-admin -- --email=admin@example.com --password=password --firstName=PhoneHub --lastName=Admin
```

The command can also use environment variables:

```env
ADMIN_FIRST_NAME=PhoneHub
ADMIN_LAST_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_me_admin_password
```

Authorization verification already done:

- Customer token calling `GET /api/v1/admin/me` returns `403`.
- Admin token calling `GET /api/v1/admin/me` returns `200`.
- Admin creation script refuses to run without email/password.

## Brand Module Completed

Brand management has been implemented.

Completed files:

- `src/routes/brand.routes.js`
- `src/routes/admin-brand.routes.js`
- `src/controllers/brand.controller.js`
- `src/services/brand.service.js`
- `src/repositories/brand.repository.js`
- `src/validators/brand.validator.js`
- `src/utils/brand.js`
- `src/utils/slug.js`
- `src/utils/pagination.js`

Updated files:

- `src/app.js`
- `src/routes/admin.routes.js`

Public brand endpoints:

```http
GET /api/v1/brands
GET /api/v1/brands/:slug
```

Admin brand endpoints:

```http
GET    /api/v1/admin/brands
POST   /api/v1/admin/brands
PATCH  /api/v1/admin/brands/:id
DELETE /api/v1/admin/brands/:id
```

Brand features:

- Public users can list active brands.
- Public users can view active brand details by slug.
- Admins can list all brands.
- Admins can create brands.
- Admins can update brands.
- Admins can archive brands by setting status to `INACTIVE`.
- Brand slugs are generated automatically from the name if not provided.
- Duplicate brand slugs return `409`.
- List endpoints support pagination.
- List endpoints support search.
- Admin list endpoint can filter by status.

Brand verification already done:

- Admin can create a brand.
- Public list can see an active brand.
- Public detail can see an active brand by slug.
- Duplicate brand slug is rejected with `409`.
- Admin can update a brand.
- Customer is blocked from admin brand creation with `403`.
- Admin can archive a brand.
- Archived brand is hidden from public detail route.

## Category Module Completed

Category management has been implemented.

Completed files:

- `src/routes/category.routes.js`
- `src/routes/admin-category.routes.js`
- `src/controllers/category.controller.js`
- `src/services/category.service.js`
- `src/repositories/category.repository.js`
- `src/validators/category.validator.js`
- `src/utils/category.js`

Updated files:

- `src/app.js`
- `src/routes/admin.routes.js`

Public category endpoints:

```http
GET /api/v1/categories
GET /api/v1/categories/:slug
```

Admin category endpoints:

```http
GET    /api/v1/admin/categories
POST   /api/v1/admin/categories
PATCH  /api/v1/admin/categories/:id
DELETE /api/v1/admin/categories/:id
```

Category features:

- Public users can list active categories.
- Public users can view active category details by slug.
- Admins can list all categories.
- Admins can create categories.
- Admins can update categories.
- Admins can archive categories by setting status to `INACTIVE`.
- Categories can be nested with `parentId`.
- Category slugs are generated automatically from the name if not provided.
- Duplicate category slugs return `409`.
- A category cannot be its own parent.
- Missing parent categories are rejected.
- List endpoints support pagination.
- List endpoints support search.
- List endpoints can filter by `parentId`.
- Admin list endpoint can filter by status.

Category verification already done:

- Admin can create a root category.
- Admin can create a child category with `parentId`.
- Public list can see active root categories.
- Public detail can see an active category by slug.
- Duplicate category slug is rejected with `409`.
- Admin can update a category.
- Self-parent update is rejected with `400`.
- Customer is blocked from admin category creation with `403`.
- Admin can archive a category.
- Archived category is hidden from public detail route.

## Product Module Completed

Product management has been implemented.

Completed files:

- `src/routes/product.routes.js`
- `src/routes/admin-product.routes.js`
- `src/controllers/product.controller.js`
- `src/services/product.service.js`
- `src/repositories/product.repository.js`
- `src/validators/product.validator.js`
- `src/utils/product.js`

Updated files:

- `src/app.js`
- `src/routes/admin.routes.js`

Public product endpoints:

```http
GET /api/v1/products
GET /api/v1/products/:slug
```

Admin product endpoints:

```http
GET    /api/v1/admin/products
POST   /api/v1/admin/products
PATCH  /api/v1/admin/products/:id
DELETE /api/v1/admin/products/:id
```

Product features:

- Public users can list active, non-archived products.
- Public users can view active product details by slug.
- Admins can list products.
- Admins can create products.
- Admins can update products.
- Admins can archive products by setting status to `INACTIVE` and `deleted_at`.
- Products can reference brands and categories.
- Product slugs are generated automatically from the name if not provided.
- Duplicate product slugs return `409`.
- Missing brand/category references are rejected.
- Inactive brand/category references are rejected.
- List endpoints support pagination.
- List endpoints support search.
- List endpoints support brand and category filters.
- List endpoints support featured filter.
- List endpoints support sorting by newest, price, and name.

Product verification already done:

- Admin can create a product linked to a brand and category.
- Public list can filter and see active products.
- Public detail can see an active product by slug.
- Duplicate product slug is rejected with `409`.
- Admin can update a product.
- Customer is blocked from admin product creation with `403`.
- Missing brand reference is rejected with `404`.
- Admin can archive a product.
- Archived product is hidden from public detail route.

## Product Variant Module Completed

Product variant management has been implemented.

Completed files:

- `src/routes/admin-product-variant.routes.js`
- `src/controllers/product-variant.controller.js`
- `src/services/product-variant.service.js`
- `src/repositories/product-variant.repository.js`
- `src/validators/product-variant.validator.js`
- `src/utils/product-variant.js`

Updated files:

- `src/routes/admin.routes.js`

Admin product variant endpoints:

```http
GET    /api/v1/admin/variants
GET    /api/v1/admin/products/:productId/variants
POST   /api/v1/admin/products/:productId/variants
PATCH  /api/v1/admin/variants/:id
DELETE /api/v1/admin/variants/:id
```

Variant features:

- Admins can list variants.
- Admins can list variants for one product.
- Admins can create variants for a product.
- Admins can update variant SKU, attributes, price, sale price, stock, threshold, and status.
- Admins can archive variants by setting status to `INACTIVE`.
- SKU must be unique.
- Variant belongs to a valid, non-archived product.
- Sale price cannot be greater than price.
- Stock quantity cannot be negative.
- Low stock threshold cannot be negative.
- List endpoint supports pagination.
- List endpoint supports product filter.
- List endpoint supports status filter.
- List endpoint supports low-stock filter.

Variant verification already done:

- Admin can create a variant for a product.
- Admin can list variants by product.
- Admin can list all variants with product filter.
- Duplicate SKU is rejected with `409`.
- Admin can update stock, price, and sale price.
- Low-stock filter can find a variant below threshold.
- Customer is blocked from admin variant creation with `403`.
- Invalid sale price is rejected with `400`.
- Admin can archive a variant.

## Useful Commands

Start development server:

```bash
npm run dev
```

Start normal server:

```bash
npm start
```

Run migrations:

```bash
npm run migrate
```

Create admin:

```bash
npm run create-admin -- --email=admin@example.com --password=Password123
```

## Recommended Next Task

Next recommended task:

```text
Search, filter, and pagination improvements
```

Reason:

Product variants are ready. The next backend feature should improve product search and filtering so customers can filter products by variant attributes like color, storage, stock availability, and price range.

Recommended build order:

1. Search, filter, and pagination improvements
2. Address module
3. Cart module
4. Checkout and orders
