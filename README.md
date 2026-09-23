Hell My name is nat sokphary, this me concept to building project this you can check and reading , before to understanding about whole plane, # PhoneHub Backend Project Documentation

## 1. Project Overview

**Project Name:** PhoneHub  
**Project Type:** Phone & Accessories E-Commerce Platform  
**Development Approach:** Backend-first  
**Primary Goal:** Build a production-style REST API for selling smartphones and phone accessories, with secure authentication, role-based authorization, product variants, cart, checkout, orders, payments, reviews, inventory control, caching, API documentation, testing, and deployment readiness.

### Core Technology Stack

#### Backend
- Node.js
- Express.js
- PostgreSQL
- `pg` package for PostgreSQL access
- JWT for authentication
- bcrypt for password hashing
- Zod for validation
- Redis for caching and selected temporary data
- Swagger / OpenAPI for API documentation
- Docker for containerization

#### Frontend
- React
- React Router
- Axios / Fetch API
- State management to be selected later

### Backend-First Strategy

The project will be developed in this order:

1. Backend foundation
2. Database design
3. Authentication
4. Authorization
5. Product catalog
6. Product variants
7. Inventory
8. Cart
9. Checkout
10. Orders
11. Payments
12. Reviews and wishlist
13. Coupons
14. Notifications
15. Redis caching
16. Swagger documentation
17. Automated testing
18. Docker
19. Deployment
20. React frontend

---

# 2. Business Concept

PhoneHub is an online store focused on:

- Smartphones
- Phone cases
- Screen protectors
- Chargers
- Charging cables
- Power banks
- Earbuds
- Headphones
- Smart watches
- Phone holders
- Memory cards
- Other mobile accessories

The system must support products that may have multiple variants.

Example:

```text
iPhone 16
├── 128GB
│   ├── Black
│   └── White
├── 256GB
│   ├── Black
│   └── Pink
└── 512GB
    └── Black
```

Each variant can have its own:

- SKU
- Color
- Storage
- RAM
- Price
- Discount price
- Stock quantity
- Availability status

---

# 3. Project Objectives

The system should provide:

- Secure customer registration and login
- Admin login
- Product and category management
- Brand management
- Product variant management
- Product image management
- Cart functionality
- Wishlist functionality
- Checkout
- Address management
- Order creation
- Order tracking
- Payment records
- Stock updates
- Customer reviews
- Coupon support
- Search and filtering
- Pagination
- Sales reports
- Inventory reports
- Audit logging
- API documentation
- Automated tests
- Docker-based deployment support

---

# 4. User Roles

## 4.1 Customer

A customer can:

- Register an account
- Login and logout
- Refresh authentication token
- Update profile
- Change password
- Manage addresses
- Browse products
- Search products
- Filter products
- View product details
- Add items to cart
- Update cart quantity
- Remove cart items
- Add products to wishlist
- Checkout
- Create orders
- View order history
- View order details
- Track order status
- Submit reviews after purchasing
- Apply coupons
- View available payment methods

## 4.2 Admin

An admin can:

- Login securely
- Manage users
- Manage customer accounts
- Manage brands
- Manage categories
- Manage products
- Manage product variants
- Manage product images
- Update stock
- View stock history
- Manage orders
- Change order statuses
- Manage coupons
- Manage reviews
- View sales reports
- View product reports
- View inventory reports
- View audit logs

## 4.3 Optional Future Roles

Possible future roles:

- Super Admin
- Store Manager
- Inventory Staff
- Customer Support Staff
- Content Manager

For the first version, use:

```text
ADMIN
CUSTOMER
```

---

# 5. Main Functional Modules

## 5.1 Authentication Module

### Features

- Customer registration
- Customer login
- Admin login
- Logout
- Access token
- Refresh token
- Password hashing
- Change password
- Forgot password
- Reset password
- Optional email verification

### Security Rules

Passwords must never be stored in plain text.

Use:

```text
bcrypt
```

Authentication flow:

```text
User Login
   ↓
Validate Input
   ↓
Find User
   ↓
Compare Password
   ↓
Generate Access Token
   ↓
Generate Refresh Token
   ↓
Return Authentication Result
```

### JWT Strategy

Use two token types.

#### Access Token

Short lifetime.

Example:

```text
15 minutes
```

Used for protected API requests.

#### Refresh Token

Longer lifetime.

Example:

```text
7 days
```

Used to request a new access token.

Refresh tokens should be stored securely and revocable.

---

# 6. User Module

## User Profile Fields

Suggested fields:

```text
id
first_name
last_name
email
phone
password_hash
role
status
email_verified_at
created_at
updated_at
```

### User Status

```text
ACTIVE
SUSPENDED
BLOCKED
```

### Customer Features

- Get current profile
- Update profile
- Change password

Admin features:

- List users
- Search users
- Filter users
- View user details
- Suspend user
- Reactivate user

---

# 7. Address Module

A customer may have multiple shipping addresses.

Example fields:

```text
id
user_id
recipient_name
phone
address_line
city
province
postal_code
country
is_default
created_at
updated_at
```

Features:

- Add address
- Update address
- Delete address
- Set default address
- List customer addresses

---

# 8. Brand Module

Examples:

```text
Apple
Samsung
Xiaomi
Oppo
Vivo
Google
Anker
Baseus
UGREEN
JBL
```

Suggested fields:

```text
id
name
slug
description
logo_url
status
created_at
updated_at
```

Admin features:

- Create brand
- Update brand
- Delete / archive brand
- List brands

Customer features:

- Browse brands

---

# 9. Category Module

Examples:

```text
Phones
Phone Cases
Screen Protectors
Chargers
Cables
Power Banks
Earbuds
Headphones
Smart Watches
Phone Holders
Memory Cards
```

Suggested fields:

```text
id
parent_id
name
slug
description
image_url
status
created_at
updated_at
```

The `parent_id` allows nested categories.

Example:

```text
Accessories
├── Chargers
├── Cables
├── Power Banks
└── Earbuds
```

---

# 10. Product Module

A product represents the main product identity.

Example:

```text
iPhone 16
Samsung Galaxy S25
Anker Nano Charger
Baseus 20,000mAh Power Bank
```

Suggested fields:

```text
id
brand_id
category_id
name
slug
short_description
description
base_price
status
is_featured
created_at
updated_at
deleted_at
```

### Product Status

```text
DRAFT
ACTIVE
INACTIVE
OUT_OF_STOCK
```

### Product Features

Admin:

- Create product
- Update product
- Archive product
- Upload images
- Add variants
- Manage specifications

Customer:

- Browse products
- Search
- Filter
- Sort
- View product detail

---

# 11. Product Variant Module

This is one of the most important modules.

A product may have many variants.

Example:

```text
Product:
iPhone 16

Variants:
128GB / Black
128GB / White
256GB / Black
256GB / Pink
```

Suggested fields:

```text
id
product_id
sku
color
storage
ram
price
sale_price
stock_quantity
low_stock_threshold
status
created_at
updated_at
```

Optional fields:

```text
barcode
weight
condition
```

### Important Rule

Inventory should normally belong to the variant, not directly to the product.

Correct:

```text
iPhone 16
└── Variant 128GB Black
    └── stock_quantity = 8
```

Not:

```text
iPhone 16
└── stock_quantity = 50
```

when variants have independent stock.

---

# 12. Product Images

Suggested fields:

```text
id
product_id
variant_id
image_url
alt_text
sort_order
is_primary
created_at
```

Images can belong to:

- Product
- Specific variant

Example:

Black variant can have black product images.

---

# 13. Product Specifications

Phones require flexible specifications.

Examples:

```text
Display
Chipset
RAM
Storage
Battery
Camera
Operating System
Network
SIM
Charging
Water Resistance
```

Recommended design:

```text
product_specifications
```

Suggested fields:

```text
id
product_id
spec_key
spec_value
sort_order
```

Example:

```text
Display     → 6.1-inch OLED
Chipset     → A18
Battery     → 3561 mAh
OS          → iOS
```

---

# 14. Search, Filter and Pagination

Customers must be able to search.

Example:

```text
GET /api/v1/products?search=iphone
```

Filters:

```text
brand
category
minimum_price
maximum_price
color
storage
availability
```

Sorting:

```text
price_asc
price_desc
newest
popular
rating
```

Pagination:

```text
page
limit
```

Example:

```http
GET /api/v1/products?page=1&limit=20&brand=apple&storage=256GB
```

Response should include metadata:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

# 15. Cart Module

Each customer can have one active cart.

Suggested tables:

```text
carts
cart_items
```

## Cart

```text
id
user_id
created_at
updated_at
```

## Cart Item

```text
id
cart_id
product_variant_id
quantity
created_at
updated_at
```

### Cart Rules

Before adding an item:

- Product must exist
- Variant must exist
- Product must be active
- Variant must be active
- Quantity must be positive
- Quantity cannot exceed stock

Example flow:

```text
Add Item
   ↓
Check Variant
   ↓
Check Stock
   ↓
Check Existing Cart Item
   ↓
Insert or Update Quantity
```

Cart totals should normally be calculated by the server.

Never trust totals sent by the frontend.

---

# 16. Wishlist Module

Suggested fields:

```text
id
user_id
product_id
created_at
```

Features:

- Add product
- Remove product
- List wishlist

Unique constraint:

```text
user_id + product_id
```

should not be duplicated.

---

# 17. Checkout Module

Checkout is a business process, not only a CRUD endpoint.

Flow:

```text
Customer
   ↓
Cart
   ↓
Validate Cart
   ↓
Validate Stock
   ↓
Select Address
   ↓
Apply Coupon
   ↓
Calculate Totals
   ↓
Select Payment Method
   ↓
Create Order
   ↓
Create Order Items
   ↓
Reserve / Reduce Stock
   ↓
Create Payment Record
   ↓
Clear Cart
```

Use a PostgreSQL transaction.

If any critical step fails:

```text
ROLLBACK
```

If all steps succeed:

```text
COMMIT
```

---

# 18. Order Module

Suggested order fields:

```text
id
user_id
order_number
shipping_address_snapshot
subtotal
discount_amount
shipping_fee
tax_amount
total_amount
payment_status
order_status
notes
created_at
updated_at
```

### Order Item

Suggested fields:

```text
id
order_id
product_id
product_variant_id
product_name
sku
variant_description
unit_price
quantity
line_total
```

Important:

Order items should store a snapshot of product information.

Do not depend only on the current product record because product names and prices may change later.

---

# 19. Order Status

Recommended flow:

```text
PENDING
   ↓
CONFIRMED
   ↓
PROCESSING
   ↓
SHIPPED
   ↓
DELIVERED
```

Alternative outcomes:

```text
CANCELLED
REFUNDED
```

Admin controls status transitions.

Customer should not be allowed to arbitrarily change an order to delivered.

---

# 20. Payment Module

For development, start with mock payment methods.

Examples:

```text
Cash on Delivery
Mock Card Payment
Mock QR Payment
```

Later integrations can include real payment providers.

Suggested fields:

```text
id
order_id
payment_method
transaction_reference
amount
status
paid_at
created_at
updated_at
```

Payment status:

```text
PENDING
PAID
FAILED
REFUNDED
```

Security rule:

Never store raw card numbers, CVV, or sensitive payment credentials.

Use an external payment provider when real payments are added.

---

# 21. Coupon Module

Suggested fields:

```text
id
code
discount_type
discount_value
minimum_order_amount
maximum_discount_amount
usage_limit
usage_count
starts_at
expires_at
status
created_at
updated_at
```

Discount types:

```text
PERCENTAGE
FIXED
```

Coupon validation checks:

- Exists
- Active
- Not expired
- Started
- Usage limit not exceeded
- Minimum cart total reached

---

# 22. Reviews Module

Suggested fields:

```text
id
user_id
product_id
rating
comment
status
created_at
updated_at
```

Rules:

- Rating from 1 to 5
- Customer should ideally purchase the product before reviewing
- One review per customer per product unless edited
- Admin can hide abusive reviews

Review status:

```text
PENDING
APPROVED
REJECTED
```

---

# 23. Inventory Management

Inventory is linked to product variants.

Minimum fields:

```text
product_variants.stock_quantity
```

For better tracking, add:

```text
inventory_movements
```

Fields:

```text
id
product_variant_id
type
quantity
reference_type
reference_id
note
created_by
created_at
```

Movement types:

```text
STOCK_IN
SALE
ORDER_CANCEL
RETURN
ADJUSTMENT
```

Example:

```text
Initial stock: 20

Sale:
20 - 2 = 18

Cancelled order:
18 + 2 = 20
```

This gives you a stock audit trail.

---

# 24. Notifications

Future notification types:

- Order placed
- Order confirmed
- Order shipped
- Order delivered
- Password reset
- Low stock
- Payment successful

Initial implementation can store notifications in the database.

Suggested fields:

```text
id
user_id
type
title
message
is_read
created_at
```

Email notifications can be added later.

---

# 25. Admin Dashboard

Backend endpoints should support dashboard data.

Examples:

```text
Total Customers
Total Products
Total Orders
Orders Today
Revenue Today
Revenue This Month
Low Stock Products
Top Selling Products
Recent Orders
```

Possible endpoint:

```http
GET /api/v1/admin/dashboard
```

---

# 26. Reports

## Sales Reports

- Daily sales
- Monthly sales
- Revenue by date
- Revenue by category
- Revenue by brand
- Top products

## Inventory Reports

- Current stock
- Low stock
- Out of stock
- Inventory movements

## Customer Reports

- New registrations
- Top customers
- Customer order count

---

# 27. Audit Logging

Important administrative actions should be logged.

Suggested table:

```text
audit_logs
```

Fields:

```text
id
user_id
action
entity_type
entity_id
old_values
new_values
ip_address
user_agent
created_at
```

Examples:

```text
ADMIN_CREATED_PRODUCT
ADMIN_UPDATED_PRICE
ADMIN_CHANGED_ORDER_STATUS
ADMIN_SUSPENDED_USER
```

---

# 28. PostgreSQL Database Plan

Initial table list:

```text
users
refresh_tokens
addresses

brands
categories
products
product_variants
product_images
product_specifications

carts
cart_items
wishlists

orders
order_items
payments

coupons
coupon_usages

reviews

inventory_movements

notifications

audit_logs
```

Possible future tables:

```text
roles
permissions
role_permissions

shipping_methods
returns
refunds
product_questions
product_answers
recently_viewed
```

---

# 29. Database Relationship Summary

```text
users
├── addresses
├── cart
│   └── cart_items
├── wishlist
├── orders
│   ├── order_items
│   └── payments
├── reviews
├── notifications
└── refresh_tokens

brands
└── products

categories
└── products

products
├── product_variants
├── product_images
├── product_specifications
└── reviews

product_variants
├── cart_items
├── order_items
└── inventory_movements
```

---

# 30. Backend Architecture

Recommended modular structure:

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   └── env.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── brand.controller.js
│   │   ├── category.controller.js
│   │   ├── product.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── payment.controller.js
│   │   └── review.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── brand.routes.js
│   │   ├── category.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   └── review.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   ├── checkout.service.js
│   │   └── order.service.js
│   │
│   ├── repositories/
│   │   ├── user.repository.js
│   │   ├── product.repository.js
│   │   └── order.repository.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── rate-limit.middleware.js
│   │   ├── not-found.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── product.validator.js
│   │   ├── cart.validator.js
│   │   └── order.validator.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   ├── pagination.js
│   │   ├── api-error.js
│   │   └── logger.js
│   │
│   ├── docs/
│   │   └── swagger.js
│   │
│   ├── app.js
│   └── server.js
│
├── migrations/
├── seeds/
├── tests/
├── docker/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

# 31. Architecture Responsibilities

## Routes

Routes define:

- URL
- HTTP method
- Middleware
- Controller

Example:

```text
POST /api/v1/auth/login
```

## Controller

Controller responsibilities:

- Receive request
- Read validated input
- Call service
- Return HTTP response

Controllers should not contain large business logic.

## Service

Service responsibilities:

- Business rules
- Transactions
- Checkout logic
- Order calculation
- Permission-related business decisions

## Repository

Repository responsibilities:

- Database queries
- Insert
- Update
- Delete
- Select

This separation keeps the project maintainable.

---

# 32. API Versioning

Use:

```text
/api/v1
```

Examples:

```text
/api/v1/auth
/api/v1/products
/api/v1/cart
/api/v1/orders
```

Later a breaking API change can become:

```text
/api/v2
```

---

# 33. API Response Standard

Success:

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {}
}
```

List:

```json
{
  "success": true,
  "data": [],
  "pagination": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# 34. HTTP Status Standards

Use common HTTP statuses consistently.

```text
200 OK
201 Created
204 No Content

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests

500 Internal Server Error
```

Examples:

```text
Invalid login → 401
Customer tries admin endpoint → 403
Product not found → 404
Duplicate email → 409
```

---

# 35. Input Validation

Use Zod.

Validate:

- `req.body`
- `req.params`
- `req.query`

Never trust client input.

Example validations:

```text
Email format
Password length
Positive quantity
Valid UUID
Valid price
Allowed enum values
Maximum string length
```

Validation must happen before business logic.

---

# 36. Security Requirements

Security must be part of the project from the beginning.

## 36.1 Password Security

Use bcrypt.

Rules:

- Never store plain password
- Never return password hash
- Use sufficient bcrypt work factor
- Require reasonable password complexity

## 36.2 JWT Security

- Store secrets in environment variables
- Short access token lifetime
- Refresh token rotation can be added
- Revoke refresh tokens on logout
- Validate token signature
- Validate token expiration

## 36.3 Authorization

Authentication asks:

```text
Who are you?
```

Authorization asks:

```text
What are you allowed to do?
```

Example:

```text
Customer → GET /products ✅
Customer → POST /admin/products ❌
Admin    → POST /admin/products ✅
```

## 36.4 Helmet

Use:

```text
helmet
```

to set common security headers.

## 36.5 CORS

Allow only trusted frontend origins in production.

Development example:

```text
http://localhost:5173
```

Do not use unrestricted CORS in production unless required.

## 36.6 Rate Limiting

Rate limit sensitive endpoints:

```text
/login
/register
/forgot-password
/reset-password
```

Possible global rate limiting can also be used.

## 36.7 SQL Injection

Use parameterized PostgreSQL queries.

Correct:

```javascript
pool.query(
  "SELECT * FROM users WHERE email = $1",
  [email]
);
```

Avoid string concatenation:

```javascript
"SELECT * FROM users WHERE email = '" + email + "'"
```

## 36.8 Sensitive Data

Never return:

```text
password_hash
refresh_token
reset_token
internal security data
```

## 36.9 Environment Variables

Secrets belong in:

```text
.env
```

Examples:

```text
JWT_SECRET
JWT_REFRESH_SECRET
DB_PASSWORD
REDIS_PASSWORD
PAYMENT_SECRET
```

Never commit `.env`.

## 36.10 File Upload Security

When image upload is added:

- Check MIME type
- Check extension
- Limit size
- Generate safe filenames
- Do not trust original filename
- Prefer external object storage later

## 36.11 Error Security

Production errors must not expose:

```text
SQL query
stack trace
database password
server file paths
JWT secrets
```

---

# 37. Authorization Middleware

Example design:

```text
authenticate
```

checks that a valid user is logged in.

```text
authorize("ADMIN")
```

checks the role.

Example route:

```javascript
router.post(
  "/products",
  authenticate,
  authorize("ADMIN"),
  createProduct
);
```

---

# 38. Redis Plan

Redis should be introduced after the base system works.

Potential uses:

- Cache popular products
- Cache product details
- Cache categories
- Cache brands
- Rate-limit storage
- Temporary OTP data
- Session-like temporary state
- Short-lived stock reservation later

Do not cache everything.

Suggested initial cache keys:

```text
products:featured
products:detail:{id}
categories:all
brands:all
```

When data changes, invalidate related cache.

Example:

```text
Admin updates product
   ↓
Update PostgreSQL
   ↓
Delete Redis product cache
```

---

# 39. Swagger / OpenAPI

Swagger should document:

- Endpoint
- HTTP method
- Parameters
- Request body
- Authentication
- Responses
- Error cases

Example API groups:

```text
Auth
Users
Brands
Categories
Products
Cart
Orders
Payments
Reviews
Admin
```

Suggested documentation route:

```text
/api-docs
```

---

# 40. Logging

Development:

```text
morgan
```

Production:

Use structured logging later.

Log:

- Request method
- URL
- response status
- response time
- error information
- important business events

Do not log:

```text
password
access token
refresh token
payment secrets
```

---

# 41. Error Handling

Use a centralized error handler.

Structure:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Error
  ↓
Global Error Middleware
```

Define custom error types when helpful.

Example:

```text
NotFoundError
ValidationError
UnauthorizedError
ForbiddenError
ConflictError
```

---

# 42. PostgreSQL Transactions

Use transactions for workflows where multiple database operations must succeed together.

Important examples:

- Checkout
- Create order
- Reduce stock
- Create payment
- Cancel order and restore stock
- Refund flows

Example:

```text
BEGIN

Create Order
Create Order Items
Reduce Stock
Create Payment

COMMIT
```

Failure:

```text
BEGIN
Create Order
Create Order Items
Stock update fails
ROLLBACK
```

---

# 43. Concurrency and Stock Safety

A real e-commerce backend must consider simultaneous purchases.

Example:

```text
Stock = 1

Customer A buys
Customer B buys
```

The API must prevent stock becoming negative.

Possible strategy:

- PostgreSQL transaction
- Lock selected variant row
- Re-check stock inside transaction
- Reduce stock only if sufficient

This is an advanced but important backend feature.

---

# 44. Recommended Initial API Endpoints

## Authentication

```http
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

## Profile

```http
GET    /api/v1/users/me
PATCH  /api/v1/users/me
PATCH  /api/v1/users/me/password
```

## Addresses

```http
GET    /api/v1/addresses
POST   /api/v1/addresses
PATCH  /api/v1/addresses/:id
DELETE /api/v1/addresses/:id
```

## Brands

```http
GET    /api/v1/brands
GET    /api/v1/brands/:slug

POST   /api/v1/admin/brands
PATCH  /api/v1/admin/brands/:id
DELETE /api/v1/admin/brands/:id
```

## Categories

```http
GET    /api/v1/categories

POST   /api/v1/admin/categories
PATCH  /api/v1/admin/categories/:id
DELETE /api/v1/admin/categories/:id
```

## Products

```http
GET    /api/v1/products
GET    /api/v1/products/:slug

POST   /api/v1/admin/products
PATCH  /api/v1/admin/products/:id
DELETE /api/v1/admin/products/:id
```

## Product Variants

```http
POST   /api/v1/admin/products/:productId/variants
PATCH  /api/v1/admin/variants/:id
DELETE /api/v1/admin/variants/:id
```

## Cart

```http
GET    /api/v1/cart
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/:id
DELETE /api/v1/cart/items/:id
DELETE /api/v1/cart
```

## Wishlist

```http
GET    /api/v1/wishlist
POST   /api/v1/wishlist/:productId
DELETE /api/v1/wishlist/:productId
```

## Checkout

```http
POST   /api/v1/checkout
```

## Orders

```http
GET    /api/v1/orders
GET    /api/v1/orders/:id
POST   /api/v1/orders/:id/cancel
```

Admin:

```http
GET    /api/v1/admin/orders
PATCH  /api/v1/admin/orders/:id/status
```

## Reviews

```http
GET    /api/v1/products/:productId/reviews
POST   /api/v1/products/:productId/reviews
PATCH  /api/v1/reviews/:id
DELETE /api/v1/reviews/:id
```

---

# 45. Minimum Viable Product (MVP)

Do not build everything at once.

Version 1 should contain:

```text
Authentication
Users
Admin / Customer roles
Brands
Categories
Products
Product variants
Cart
Addresses
Checkout
Orders
Basic payment record
Inventory updates
Validation
Error handling
Basic security
```

This is enough for a functional backend.

---

# 46. Version 2 Features

After MVP works:

```text
Product images
Wishlist
Reviews
Coupons
Search improvements
Filtering improvements
Pagination
Notifications
Admin dashboard
Sales reports
Inventory movement history
```

---

# 47. Version 3 Production Features

Add:

```text
Redis
Swagger
Automated tests
Docker
CI/CD
Object storage
Real payment integration
Email
Monitoring
Deployment hardening
```

---

# 48. Backend Development Phases

## Phase 0 — Project Setup

Goals:

- Initialize Node.js
- Install Express
- Configure environment
- Connect PostgreSQL
- Add health endpoint
- Configure gitignore

Success criteria:

```text
GET /api/v1/health
```

returns success and database connection works.

---

## Phase 1 — Scope and Data Modeling

Tasks:

- Finalize requirements
- Define roles
- Define entities
- Create ERD
- Define order lifecycle
- Define product variant model
- Define payment model

Deliverable:

```text
Database ERD
Table definitions
Business rules
```

---

## Phase 2 — Database Foundation

Tasks:

- Create migrations
- Create users table
- Create brands
- Create categories
- Create products
- Create variants
- Add indexes
- Add constraints
- Add timestamps

Also create seed data.

---

## Phase 3 — Authentication

Tasks:

- Register
- Login
- bcrypt
- JWT
- Refresh token
- Logout
- Auth middleware

Tests:

- Correct login
- Wrong password
- Duplicate email
- Expired token
- Missing token

---

## Phase 4 — Authorization

Tasks:

- Role field
- Admin middleware
- Protect admin routes

Tests:

- Customer cannot create product
- Admin can create product

---

## Phase 5 — Catalog

Build:

- Brand CRUD
- Category CRUD
- Product CRUD
- Variant CRUD
- Product specifications
- Search
- Filtering
- Pagination

---

## Phase 6 — Cart

Build:

- Create active cart
- Add item
- Update quantity
- Remove item
- Calculate subtotal

Business rules:

- Reject invalid quantity
- Reject inactive product
- Reject insufficient stock

---

## Phase 7 — Checkout and Orders

Build:

- Address validation
- Cart validation
- Order calculation
- Coupon support later
- PostgreSQL transaction
- Create order
- Create order items
- Reduce stock
- Create payment record
- Clear cart

---

## Phase 8 — Order Management

Customer:

- List orders
- View order
- Cancel when allowed

Admin:

- List orders
- Update status

Business rules:

Define legal transitions.

Example:

```text
PENDING → CONFIRMED
CONFIRMED → PROCESSING
PROCESSING → SHIPPED
SHIPPED → DELIVERED
```

---

## Phase 9 — Reviews and Wishlist

Build after order workflow is stable.

---

## Phase 10 — Redis

Start caching:

- Featured products
- Product detail
- Categories
- Brands

Measure before adding complex caching.

---

## Phase 11 — Swagger

Document every public and protected endpoint.

Include JWT authentication support in Swagger UI.

---

## Phase 12 — Testing

Testing levels:

### Unit Tests

Test:

- Price calculation
- Coupon logic
- Order state validation

### Integration Tests

Test:

- Registration
- Login
- Product CRUD
- Cart
- Checkout
- Authorization

Recommended tools:

```text
Jest
Supertest
```

---

## Phase 13 — Docker

Services:

```text
backend
postgres
redis
```

Possible Docker Compose architecture:

```text
React
   ↓
Express Container
   ├── PostgreSQL Container
   └── Redis Container
```

---

## Phase 14 — Deployment

Production checklist:

- Production environment variables
- Secure secrets
- Database migrations
- HTTPS
- Reverse proxy if needed
- Restricted CORS
- Logging
- Rate limits
- Health endpoint
- Backups
- Error monitoring

---

# 49. Testing Checklist

Authentication:

- Register valid user
- Duplicate email rejected
- Invalid email rejected
- Password validation works
- Login success
- Wrong password rejected
- Protected route without token rejected
- Customer cannot access admin endpoints

Products:

- Create
- Update
- Archive
- Search
- Filter
- Pagination
- Variant stock

Cart:

- Add valid item
- Duplicate item updates correctly
- Quantity cannot exceed stock
- Remove item

Checkout:

- Empty cart rejected
- Invalid address rejected
- Out-of-stock rejected
- Transaction rollback works
- Order created
- Stock reduced
- Cart cleared

Orders:

- Customer sees own orders
- Customer cannot see other customer's orders
- Admin sees all orders
- Invalid status transition rejected

---

# 50. Performance Requirements

Important considerations:

- Use pagination
- Use database indexes
- Avoid `SELECT *` when unnecessary
- Avoid N+1 query patterns
- Cache only high-value data
- Use PostgreSQL connection pooling
- Add indexes to common filters

Potential indexes:

```text
users.email
products.slug
products.brand_id
products.category_id
product_variants.sku
orders.user_id
orders.order_status
orders.created_at
reviews.product_id
```

---

# 51. Data Integrity Rules

Use PostgreSQL constraints.

Examples:

```text
email UNIQUE
slug UNIQUE
sku UNIQUE
quantity > 0
price >= 0
stock_quantity >= 0
rating BETWEEN 1 AND 5
```

Use foreign keys.

Use `ON DELETE` rules deliberately.

Avoid deleting important order history.

---

# 52. Soft Delete Strategy

For business records like products, prefer archiving over hard deletion.

Example:

```text
deleted_at
```

or:

```text
status = INACTIVE
```

Do not physically delete records that are referenced in historical orders.

---

# 53. Money Handling

Do not use floating-point values carelessly for money.

PostgreSQL:

```text
NUMERIC(12,2)
```

Examples:

```text
price
subtotal
discount_amount
shipping_fee
total_amount
```

Always calculate final prices on the backend.

---

# 54. Time Handling

Store timestamps consistently.

Recommended:

```text
TIMESTAMPTZ
```

Fields:

```text
created_at
updated_at
paid_at
expires_at
```

The frontend can display dates in the user's local timezone.

---

# 55. Naming Conventions

Database:

```text
snake_case
```

Examples:

```text
product_variants
created_at
user_id
```

JavaScript:

```text
camelCase
```

Examples:

```text
productId
createdAt
getProductById
```

Classes or error types:

```text
PascalCase
```

---

# 56. Environment Configuration

Example `.env`:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=phonehub_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

REDIS_HOST=localhost
REDIS_PORT=6379

CLIENT_URL=http://localhost:5173
```

Never commit the real `.env`.

Create:

```text
.env.example
```

with placeholders.

---

# 57. Git Workflow

Suggested branches:

```text
main
develop
feature/auth
feature/products
feature/cart
feature/orders
```

Commit examples:

```text
feat: add user registration
feat: implement product variants
fix: prevent cart quantity above stock
refactor: move product queries to repository
docs: add swagger product endpoints
test: add auth integration tests
```

---

# 58. README Requirements

The project README should eventually contain:

- Project description
- Tech stack
- Features
- Architecture
- Setup instructions
- Environment variables
- Database setup
- Run commands
- Docker instructions
- API docs URL
- Testing commands
- Sample admin account for development
- Screenshots after frontend exists

---

# 59. Definition of Done for Each Backend Feature

A backend feature is not finished until it includes:

1. Route
2. Validation
3. Authentication if required
4. Authorization if required
5. Controller
6. Service logic
7. Repository/database logic
8. Error handling
9. Correct HTTP response
10. Tests
11. Swagger documentation
12. Security review

---

# 60. Final Backend Request Flow

A normal request should move through:

```text
Client
  ↓
Express Route
  ↓
Rate Limit / Security Middleware
  ↓
Authentication Middleware
  ↓
Authorization Middleware
  ↓
Zod Validation
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
  ↓
Service
  ↓
Controller
  ↓
JSON Response
```

For cached endpoints:

```text
Client
  ↓
Route
  ↓
Redis Cache Check
  ├── HIT  → Return Cached Data
  └── MISS
       ↓
    PostgreSQL
       ↓
    Store Cache
       ↓
    Response
```

---

# 61. Complete E-Commerce Order Flow

```text
1. Customer registers
2. Customer logs in
3. Customer browses products
4. Customer selects a product
5. Customer selects a variant
6. Customer adds variant to cart
7. Customer updates quantities
8. Customer selects shipping address
9. Backend validates cart
10. Backend checks latest price
11. Backend checks stock
12. Backend applies coupon if valid
13. Backend calculates subtotal
14. Backend calculates discount
15. Backend calculates shipping
16. Backend calculates final total
17. Backend starts database transaction
18. Backend creates order
19. Backend creates order item snapshots
20. Backend decreases inventory
21. Backend writes inventory movement
22. Backend creates payment record
23. Backend clears cart
24. Backend commits transaction
25. Customer receives order confirmation
26. Admin sees order
27. Admin confirms order
28. Admin processes order
29. Admin marks shipped
30. Admin marks delivered
31. Customer can review purchased product
```

---

# 62. Non-Functional Requirements

## Security

The API must:

- Authenticate protected routes
- Enforce roles
- Validate all input
- Use parameterized queries
- Protect secrets
- Rate-limit sensitive endpoints
- Use secure headers

## Performance

The API should:

- Use pagination
- Use indexes
- Use connection pooling
- Cache selected read-heavy endpoints
- Avoid unnecessary database queries

## Maintainability

The code should:

- Be modular
- Separate controller/service/repository responsibilities
- Have reusable middleware
- Use consistent response structures
- Include documentation

## Reliability

The backend should:

- Handle errors centrally
- Use transactions
- Avoid negative stock
- Preserve historical order data

---

# 63. Project Milestones

## Milestone 1 — Foundation

```text
Express running
PostgreSQL connected
Environment configured
Health endpoint
```

## Milestone 2 — Auth

```text
Register
Login
JWT
Refresh token
bcrypt
Roles
```

## Milestone 3 — Catalog

```text
Brands
Categories
Products
Variants
Search
Pagination
```

## Milestone 4 — Shopping

```text
Cart
Wishlist
Addresses
```

## Milestone 5 — Orders

```text
Checkout
Orders
Payments
Inventory
```

## Milestone 6 — Advanced

```text
Reviews
Coupons
Notifications
Reports
```

## Milestone 7 — Production

```text
Redis
Swagger
Tests
Docker
Deployment
```

---

# 64. Backend MVP Success Criteria

The MVP backend is considered complete when:

- Customer can register and login
- Admin and customer roles work
- Admin can create brands
- Admin can create categories
- Admin can create products
- Admin can create variants
- Customer can browse and search products
- Customer can add a variant to cart
- Customer can manage address
- Customer can checkout
- Backend creates an order transactionally
- Stock is reduced correctly
- Customer can view order history
- Admin can manage order status
- Unauthorized access is blocked
- Invalid requests are rejected
- API has consistent error responses
- Core endpoints are tested

---

# 65. Recommended First Backend Build Order

Do not jump directly to cart or payment.

Build in this exact order:

```text
1. Project setup
2. PostgreSQL connection
3. Database schema
4. User table
5. Authentication
6. JWT middleware
7. Role authorization
8. Brand module
9. Category module
10. Product module
11. Product variant module
12. Search/filter/pagination
13. Address module
14. Cart module
15. Checkout service
16. Order module
17. Payment records
18. Inventory movement
19. Wishlist
20. Reviews
21. Coupons
22. Reports
23. Redis
24. Swagger
25. Testing
26. Docker
27. Deployment
28. React frontend
```

---

# 66. Final Project Vision

The goal is not only to build:

```text
CRUD Products
```

The goal is to build:

```text
A secure, modular, production-style e-commerce REST API
```

that demonstrates:

- Backend architecture
- PostgreSQL relational modeling
- Authentication
- Authorization
- Validation
- E-commerce business logic
- Transactions
- Inventory management
- Security
- Performance
- API documentation
- Testing
- Deployment skills

A completed project can be presented in a portfolio as:

> **PhoneHub — Full-Stack Phone & Accessories E-Commerce Platform**
>
> Built with Node.js, Express, PostgreSQL, JWT, bcrypt, Zod, Redis, Swagger, Docker, and React. The backend includes secure authentication, RBAC, product variants, cart and checkout workflows, transactional order processing, inventory tracking, product search and filtering, reviews, coupons, caching, API documentation, and automated testing.

---

# 67. Immediate Next Step

After this document is accepted, the next backend task should be:

```text
Design the PostgreSQL database schema and ERD.
```

Before writing controllers, define:

- Tables
- Columns
- Data types
- Foreign keys
- Unique constraints
- Indexes
- Status enums
- Delete behavior
- Timestamps

Recommended first database tables:

```text
users
refresh_tokens
addresses
brands
categories
products
product_variants
product_images
product_specifications
carts
cart_items
orders
order_items
payments
inventory_movements
```

Once the ERD is stable, begin migrations and backend implementation.

