# PhoneHub Database Schema

## Core Design

PhoneHub uses PostgreSQL with UUID primary keys, foreign keys, enum statuses, and `TIMESTAMPTZ` timestamps.

Money fields use `NUMERIC(12,2)`. Product stock belongs to `product_variants`, not `products`, because each color/storage/RAM combination can have its own inventory.

## Tables

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

## Main Relationships

```text
users
├── refresh_tokens
├── addresses
├── carts
│   └── cart_items
├── orders
│   ├── order_items
│   └── payments
└── inventory_movements.created_by

brands
└── products

categories
└── products

products
├── product_variants
├── product_images
├── product_specifications
└── order_items snapshots

product_variants
├── cart_items
├── order_items snapshots
└── inventory_movements
```

## Migration Command

```bash
npm run migrate
```

The migration runner records applied files in `schema_migrations`.
