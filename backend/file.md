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

## Search, Filter, and Pagination Improvements Completed

Product browsing filters have been improved to use product variant data.

Updated files:

- `src/repositories/product.repository.js`
- `src/services/product.service.js`
- `src/validators/product.validator.js`
- `src/utils/product.js`

Improved product list endpoint:

```http
GET /api/v1/products
GET /api/v1/admin/products
```

New/expanded product query filters:

```text
search
brandId
categoryId
isFeatured
color
storage
ram
minPrice
maxPrice
availability=in_stock
availability=out_of_stock
sort=newest
sort=price_asc
sort=price_desc
sort=name_asc
sort=name_desc
page
limit
```

Product list responses now include variant-derived summary fields:

```text
minEffectivePrice
maxEffectivePrice
totalStockQuantity
activeVariantCount
```

Search/filter verification already done:

- Product list can filter by variant color.
- Product list can filter by variant storage.
- Product list can filter by variant RAM.
- Product list can filter by variant effective price range.
- Product list can filter by in-stock availability.
- Product list can filter by out-of-stock availability.
- Product list can sort by variant effective price.
- Pagination metadata still works.
- Invalid price ranges are rejected with `422`.

## Address Module Completed

Customer address management has been implemented.

Completed files:

- `src/routes/address.routes.js`
- `src/controllers/address.controller.js`
- `src/services/address.service.js`
- `src/repositories/address.repository.js`
- `src/validators/address.validator.js`
- `src/utils/address.js`

Updated files:

- `src/app.js`

Customer address endpoints:

```http
GET    /api/v1/addresses
POST   /api/v1/addresses
PATCH  /api/v1/addresses/:id
PATCH  /api/v1/addresses/:id/default
DELETE /api/v1/addresses/:id
```

Address features:

- Customers can list their own addresses.
- Customers can create addresses.
- Customers can update their own addresses.
- Customers can delete their own addresses.
- Customers can set one address as default.
- First customer address automatically becomes default.
- Only one default address is kept per customer.
- Address ownership is enforced.
- Unauthenticated users cannot access address routes.

Address verification already done:

- Missing auth is rejected with `401`.
- First created address becomes default.
- Creating another default address unsets the previous default.
- Listing addresses returns only the current customer's addresses.
- Customer can update their own address.
- Cross-user address update is rejected with `404`.
- Customer can set an address as default.
- Customer can delete their own address.

## Cart Module Completed

Customer cart management has been implemented.

Completed files:

- `src/routes/cart.routes.js`
- `src/controllers/cart.controller.js`
- `src/services/cart.service.js`
- `src/repositories/cart.repository.js`
- `src/validators/cart.validator.js`
- `src/utils/cart.js`

Updated files:

- `src/app.js`

Customer cart endpoints:

```http
GET    /api/v1/cart
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/:id
DELETE /api/v1/cart/items/:id
DELETE /api/v1/cart
```

Cart features:

- Customers can view their cart.
- Cart is created automatically for a customer when needed.
- Customers can add product variants to cart.
- Adding the same variant again increases the existing cart item quantity.
- Customers can update cart item quantity.
- Customers can remove one cart item.
- Customers can clear the whole cart.
- Cart totals are calculated on the backend.
- Cart uses variant effective price: `sale_price` when present, otherwise `price`.
- Product must be active.
- Variant must be active.
- Quantity must be positive.
- Quantity cannot exceed available variant stock.
- Cart item ownership is enforced.

Cart verification already done:

- Missing auth is rejected with `401`.
- Customer can add a variant to cart.
- Duplicate add merges into one cart item.
- Over-stock add is rejected with `400`.
- Customer can update cart item quantity.
- Cross-user cart item delete is rejected with `404`.
- Customer can remove a cart item.
- Customer can clear cart.

## Checkout and Orders Module Completed

Checkout and order management has been implemented.

Completed files:

- `src/routes/checkout.routes.js`
- `src/routes/order.routes.js`
- `src/routes/admin-order.routes.js`
- `src/controllers/checkout.controller.js`
- `src/controllers/order.controller.js`
- `src/services/checkout.service.js`
- `src/services/order.service.js`
- `src/repositories/checkout.repository.js`
- `src/repositories/order.repository.js`
- `src/validators/checkout.validator.js`
- `src/validators/order.validator.js`
- `src/utils/order.js`

Updated files:

- `src/app.js`
- `src/routes/admin.routes.js`

Customer checkout/order endpoints:

```http
POST /api/v1/checkout
GET  /api/v1/orders
GET  /api/v1/orders/:id
POST /api/v1/orders/:id/cancel
```

Admin order endpoints:

```http
GET   /api/v1/admin/orders
GET   /api/v1/admin/orders/:id
PATCH /api/v1/admin/orders/:id/status
```

Checkout features:

- Checkout validates the customer's address.
- Checkout validates the cart is not empty.
- Checkout validates products and variants are active.
- Checkout validates stock is still enough.
- Checkout calculates totals on the backend.
- Checkout creates order and order item snapshots.
- Checkout reduces variant stock.
- Checkout creates inventory movement records.
- Checkout creates a payment record.
- Checkout clears the cart after success.
- Checkout runs inside a PostgreSQL transaction.

Order features:

- Customers can list their own orders.
- Customers can view their own order details.
- Customers can cancel eligible orders.
- Admins can list all orders.
- Admins can view any order details.
- Admins can update order status through legal transitions.
- Cancelling an order restores variant stock and creates `ORDER_CANCEL` inventory movements.

Checkout/order verification already done:

- Checkout creates an order from cart.
- Checkout creates order item snapshot.
- Checkout creates payment record.
- Variant stock is reduced.
- Cart is cleared after checkout.
- Customer can list orders.
- Customer can view order detail.
- Admin can list orders.
- Admin can update status from `PENDING` to `CONFIRMED`.
- Invalid status transition is rejected with `400`.
- App and order modules load successfully after stock-restore cancellation update.

## Payment and Inventory Audit Endpoints Completed

Admin payment and inventory movement visibility has been implemented.

Completed files:

- `src/routes/admin-payment.routes.js`
- `src/routes/admin-inventory-movement.routes.js`
- `src/controllers/payment.controller.js`
- `src/controllers/inventory-movement.controller.js`
- `src/services/payment.service.js`
- `src/services/inventory-movement.service.js`
- `src/repositories/payment.repository.js`
- `src/repositories/inventory-movement.repository.js`
- `src/validators/payment.validator.js`
- `src/validators/inventory-movement.validator.js`
- `src/utils/inventory-movement.js`

Updated files:

- `src/routes/admin.routes.js`

Admin payment endpoints:

```http
GET   /api/v1/admin/payments
GET   /api/v1/admin/payments/:id
PATCH /api/v1/admin/payments/:id/status
```

Admin inventory movement endpoints:

```http
GET /api/v1/admin/inventory-movements
GET /api/v1/admin/variants/:variantId/inventory-movements
```

Payment features:

- Admins can list payments.
- Admins can filter payments by order, status, and payment method.
- Admins can view payment detail.
- Admins can update payment status.
- Updating payment status also updates the related order payment status.

Inventory movement features:

- Admins can list inventory movements.
- Admins can filter by variant, type, reference type, and reference id.
- Admins can view movement history for one variant.
- Movement responses include basic variant and product context.

Payment/inventory verification already done:

- Checkout creates a payment and inventory movement.
- Admin can list pending payments.
- Admin can view payment detail.
- Admin can update payment status to `PAID`.
- Admin can list inventory movements by order reference id.
- Admin can list movements for one variant.
- Temporary test records were cleaned up in the same test script.

## Wishlist Module Completed

Customer wishlist management has been implemented.

Completed files:

- `migrations/002_create_wishlists.sql`
- `src/routes/wishlist.routes.js`
- `src/controllers/wishlist.controller.js`
- `src/services/wishlist.service.js`
- `src/repositories/wishlist.repository.js`
- `src/validators/wishlist.validator.js`
- `src/utils/wishlist.js`

Updated files:

- `src/app.js`

Customer wishlist endpoints:

```http
GET    /api/v1/wishlist
POST   /api/v1/wishlist/:productId
DELETE /api/v1/wishlist/:productId
```

Wishlist features:

- Customers can list saved products.
- Customers can add active products to wishlist.
- Customers can remove products from wishlist.
- Wishlist stores products, not variants.
- Duplicate wishlist items are rejected with `409`.
- Inactive products are rejected.
- Wishlist ownership is enforced by logged-in user.
- `wishlists` table has unique `user_id + product_id` protection.

Wishlist verification already done:

- Missing auth is rejected with `401`.
- Customer can add an active product.
- Duplicate add is rejected with `409`.
- Customer can list own wishlist.
- Another customer cannot see the first customer's wishlist.
- Inactive product add is rejected with `400`.
- Customer can remove wishlist item.
- Removing missing item returns `404`.
- Temporary test records were cleaned up in the same test script.

## Reviews Module Completed

Customer product reviews and admin moderation have been implemented.

Completed files:

- `migrations/003_create_reviews.sql`
- `src/routes/review.routes.js`
- `src/routes/admin-review.routes.js`
- `src/controllers/review.controller.js`
- `src/services/review.service.js`
- `src/repositories/review.repository.js`
- `src/validators/review.validator.js`
- `src/utils/review.js`

Updated files:

- `src/app.js`
- `src/routes/admin.routes.js`

Public/customer review endpoints:

```http
GET    /api/v1/products/:productId/reviews
POST   /api/v1/products/:productId/reviews
PATCH  /api/v1/reviews/:id
DELETE /api/v1/reviews/:id
```

Admin review endpoints:

```http
GET   /api/v1/admin/reviews
PATCH /api/v1/admin/reviews/:id/status
```

Review features:

- Public users can list approved reviews for a product.
- Customers can review active products after a delivered purchase.
- Customers can update their own reviews.
- Updating a review resets status to `PENDING`.
- Customers can delete their own reviews.
- Admins can list reviews by product, user, and status.
- Admins can approve, reject, or return reviews to pending.
- Rating is limited to 1 through 5.
- One customer can only review a product once.

Review verification already done:

- Customer without delivered purchase is rejected with `403`.
- Customer with delivered purchase can create review.
- New review starts as `PENDING`.
- Duplicate review is rejected with `409`.
- Admin can list pending reviews.
- Admin can approve review.
- Public review list shows approved reviews.
- Customer update resets review status to `PENDING`.
- Cross-user delete is rejected with `404`.
- Owner can delete review.
- Temporary test records were cleaned up in the same test script.

## Automated Tests Completed

Core integration tests have been added with Jest and Supertest.

Completed files:

- `jest.config.js`
- `tests/setup-env.js`
- `tests/integration/core-flow.test.js`

Updated files:

- `package.json`
- `package-lock.json`
- `src/app.js`
- `src/config/env.js`

New test commands:

```bash
npm test
npm run test:watch
```

Test coverage currently includes:

- Customer registration.
- Admin login.
- Customer blocked from admin route.
- Admin brand/category/product/variant setup.
- Public product listing with stock availability.
- Add variant to cart.
- Reject cart quantity above stock.
- Create address.
- Checkout order from cart.
- Cart cleared after checkout.
- Wishlist add and duplicate rejection.
- Review blocked before delivered purchase.
- Admin order status transitions to delivered.
- Review creation after delivered purchase.
- Admin review approval.
- Public approved review listing.
- Cross-user review delete blocked.

Test verification already done:

```text
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

The test suite creates temporary `jest_*` data and cleans it up after the run.

## Swagger Documentation Completed

Swagger/OpenAPI documentation has been added.

Completed files:

- `src/docs/swagger.js`

Updated files:

- `src/app.js`
- route files under `src/routes/` with OpenAPI annotations
- `package.json`
- `package-lock.json`

Installed dependencies:

- `swagger-jsdoc`
- `swagger-ui-express`

Swagger endpoints:

```http
GET /api-docs
GET /api-docs.json
```

Swagger features:

- Browser API documentation page.
- OpenAPI JSON spec.
- Bearer token authorization support.
- Request body examples for core modules.
- Documented auth, catalog, cart, checkout, orders, wishlist, reviews, admin payments, and inventory endpoints.

Swagger verification already done:

- App loads successfully.
- OpenAPI spec generates successfully.
- Spec currently documents 46 paths.
- `GET /api-docs.json` returns `200` with OpenAPI `3.0.0`.
- Automated tests still pass.

## Docker Setup

Docker setup is now available for local development and teammate onboarding.

Docker files added:

- `Dockerfile` builds the Node.js backend image.
- `.dockerignore` keeps local files like `node_modules`, `.env`, logs, and Git metadata out of the image.
- `docker-compose.yml` runs PostgreSQL and the backend together.

Docker behavior:

- PostgreSQL runs inside Docker with database `phonehub_db`.
- PostgreSQL is exposed on local port `5433` to avoid conflicts with a local PostgreSQL on `5432`.
- Backend runs on `http://localhost:5000`.
- Backend waits for PostgreSQL health check before starting.
- Backend runs migrations automatically before starting.
- Swagger remains available at `http://localhost:5000/api-docs`.

Docker commands:

```bash
npm run docker:up
npm run docker:down
npm run docker:logs
```

Create admin inside Docker after the stack is running:

```bash
docker compose exec backend npm run create-admin -- --email=admin@example.com --password=Password123
```

## README Documentation Completed

README documentation has been added for teammate onboarding.

Completed file:

- `README.md`

README includes:

- Project overview.
- Tech stack.
- Local environment setup.
- Local run commands.
- Docker run commands.
- Admin creation commands.
- Swagger documentation links.
- Main public, customer, and admin modules.
- Common API URLs.
- Bearer token authorization note.
- Test commands.
- Database migration notes.
- Current recommended next task.

## Automated Test Coverage Expanded

More integration coverage has been added for important backend flows.

Updated file:

- `tests/integration/core-flow.test.js`

New coverage added:

- Customer order list and order detail after checkout.
- Cross-user order protection.
- Admin payment list, payment detail, and payment status update.
- Admin inventory movement history for a purchased variant.
- Wishlist list, duplicate protection, cross-user isolation, and removal.
- Review duplicate protection and owner update flow.

Verification result:

```text
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
```

## Redis Setup Completed

Redis has been added as the first temporary-data service for the backend.

Updated files:

- `package.json`
- `package-lock.json`
- `.env.example`
- `docker-compose.yml`
- `src/config/env.js`
- `src/config/redis.js`
- `src/middleware/rate-limit.middleware.js`
- `src/routes/auth.routes.js`
- `README.md`

Redis behavior added:

- Docker Compose now starts a Redis service.
- Backend uses `REDIS_URL` to connect to Redis.
- Auth rate limiting protects register, login, and refresh token endpoints.
- Rate limit is 20 attempts per 15 minutes per IP, route, and email when available.
- If the limit is exceeded, API returns `429 Too Many Requests`.
- Automated tests skip Redis rate limiting to stay deterministic.
- Development requests fail open if Redis is unavailable, so local auth is not blocked by a missing Redis service.

Verification result:

```text
docker compose config passed
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
```

## Frontend Foundation Started

A separate React frontend project has been created beside the backend.

Frontend folder:

- `/home/phari/Desktop/phoneHub/frontend`

Frontend stack:

- React
- Vite
- React Router
- Lucide React icons

Completed frontend files/features:

- Product catalog page.
- Product detail page.
- Login page.
- Register page.
- Cart page foundation.
- Account page foundation.
- Shared app layout and navigation.
- API client using `VITE_API_BASE_URL`.
- Auth context with token storage.
- Demo product fallback when backend is not running.
- Frontend README and env example.

Verification result:

```text
npm run build passed
```

Frontend run command:

```bash
cd /home/phari/Desktop/phoneHub/frontend
npm run dev
```

## Frontend Cart And Checkout Flow Completed

The customer cart and checkout browser flow has been connected to backend endpoints.

Updated frontend files:

- `src/api/client.js`
- `src/pages/CartPage.jsx`
- `src/pages/CheckoutPage.jsx`
- `src/App.jsx`
- `src/components/AppLayout.jsx`
- `src/index.css`
- `README.md`

Completed frontend behavior:

- Cart loads from `GET /api/v1/cart`.
- Customer can increase/decrease cart item quantity.
- Customer can remove one cart item.
- Customer can clear the cart.
- Checkout loads cart and addresses.
- Customer can create a shipping address.
- Customer can select an existing address.
- Customer can select payment method.
- Customer can add checkout notes.
- Customer can place order through `POST /api/v1/checkout`.
- Success screen shows backend order number and total.

Verification result:

```text
frontend npm run lint passed
frontend npm run build passed
```

## Frontend Tailwind CSS Migration Completed

Frontend styling has been migrated to Tailwind CSS for reusable UX patterns and faster page development.

Updated frontend files:

- `package.json`
- `package-lock.json`
- `vite.config.js`
- `src/index.css`
- `src/components/ui.js`
- `README.md`

Tailwind behavior:

- Vite now uses the official `@tailwindcss/vite` plugin.
- `src/index.css` imports Tailwind.
- Existing frontend UI classes are now powered by Tailwind `@apply`.
- Future frontend work should use Tailwind utility classes or reusable Tailwind component classes.

Verification result:

```text
frontend npm run lint passed
frontend npm run build passed
```

## Frontend Wishlist And Order History Completed

Customer wishlist and order history screens have been connected to backend endpoints.

Updated frontend files:

- `src/api/client.js`
- `src/App.jsx`
- `src/components/AppLayout.jsx`
- `src/pages/ProductDetailPage.jsx`
- `src/pages/AccountPage.jsx`
- `src/pages/WishlistPage.jsx`
- `src/pages/OrdersPage.jsx`
- `src/pages/OrderDetailPage.jsx`
- `src/index.css`
- `README.md`

Completed frontend behavior:

- Product detail can add real backend products to wishlist.
- Customer can view wishlist products.
- Customer can remove products from wishlist.
- Customer can view order history.
- Customer can open order detail.
- Order detail shows order items, payment summary, statuses, and total.
- Customer can cancel eligible orders.
- Navbar and account page link to wishlist and orders.
- New UI uses Tailwind CSS component classes.

Verification result:

```text
frontend npm run lint passed
frontend npm run build passed
```

## Frontend Review Submission Flow Completed

Customer review display and submission flow has been connected to backend review endpoints.

Updated frontend files:

- `src/api/client.js`
- `src/pages/ProductDetailPage.jsx`
- `src/pages/OrderDetailPage.jsx`
- `src/index.css`
- `README.md`

Completed frontend behavior:

- Product detail loads approved reviews from `GET /api/v1/products/:productId/reviews`.
- Product detail shows average rating, review count, review cards, and empty review state.
- Delivered order detail shows review form for each purchased product.
- Customer can choose 1 to 5 star rating.
- Customer can submit optional review comment.
- Review submits through `POST /api/v1/products/:productId/reviews`.
- Success message explains the review is pending admin approval.
- Review UI uses Tailwind CSS component classes.

UI check:

- Frontend build passed.
- Frontend lint passed.
- Headless browser loaded the running Vite app without Tailwind/Vite runtime errors after the CSS fix.
- A 1440x1000 screenshot was captured for the storefront route during validation.

Verification result:

```text
frontend npm run lint passed
frontend npm run build passed
```

## Frontend Account Dashboard And Address Management Completed

The account page has been upgraded from a small profile card into a customer dashboard.

Updated frontend files:

- `src/api/client.js`
- `src/pages/AccountPage.jsx`
- `src/index.css`
- `README.md`

Completed frontend behavior:

- Account page shows profile summary.
- Account page shows wishlist, orders, and address counts.
- Account page loads recent orders.
- Customer can list saved addresses.
- Customer can create a shipping address.
- Customer can set a default address.
- Customer can delete saved addresses.
- Admin role gets a visible admin note until the admin dashboard is created.
- UI now fills the page more naturally and uses Tailwind CSS component classes.

Verification result:

```text
frontend npm run lint passed
frontend npm run build passed
```

## Frontend Admin Dashboard Foundation Completed

The frontend now has a separate admin workspace for store operations.

Updated frontend files:

- `src/App.jsx`
- `src/api/client.js`
- `src/components/AppLayout.jsx`
- `src/pages/AccountPage.jsx`
- `src/pages/AdminDashboardPage.jsx`
- `src/index.css`
- `README.md`

Completed frontend behavior:

- `/admin` route was added.
- Guest users see a login prompt before accessing admin dashboard.
- Logged-in non-admin users see an admin-only access message.
- Admin users see a store operations dashboard with header, sidebar, metric cards, chart area, and recent orders.
- Admin navigation link appears only for `ADMIN` users.
- Account page admin note now links to the admin dashboard.
- Dashboard loads admin summaries for products, variants, orders, payments, inventory movements, and reviews.
- Dashboard has dark/light toggle, notification button, admin profile link, logout, metric cards, sales chart, recent order list, payment list, inventory movement list, review queue, and catalog snapshot.
- Dashboard refresh button reloads admin data without leaving the page.
- Admin UI uses Tailwind CSS component classes and the existing light/dark theme tokens.

Verification result:

```text
frontend npm run lint passed with one non-blocking React effect warning
frontend npm run build passed
```

## Demo Product Seed Data Completed

Local fake product data has been added for storefront testing.

Completed files:

- `scripts/seed-products.js`
- `package.json`

Seed command:

```bash
npm run seed:products
```

What the seed creates:

- 20 active products
- Active brands for the products
- Active product categories
- One active variant per seeded product
- Stock quantities for each seeded variant
- Inventory `STOCK_IN` movement records for seed stock

Seed verification result:

```text
products: 20
variants: 21
brands: 9
categories: 5
```

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

Run tests:

```bash
npm test
```

Open Swagger docs:

```http
http://localhost:5000/api-docs
```

## Recommended Next Task

Next recommended task:

```text
Frontend admin product and variant management screens
```

Reason:

Frontend admin dashboard foundation is complete. The next useful task is to let admin users create, update, and archive products and variants from the frontend instead of using Postman or Swagger.

Recommended build order:

1. Frontend admin product and variant management screens
2. Frontend admin order/payment status actions
3. Frontend UI polish and responsive pass
