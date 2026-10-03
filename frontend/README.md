# PhoneHub Frontend

React + Vite frontend for the PhoneHub e-commerce project. This app is separate from the backend and connects to the backend REST API.

## Tech Stack

- React
- Vite
- React Router
- Lucide React icons
- Tailwind CSS

## Setup

Install dependencies:

```bash
npm install
```

Create local env file:

```bash
cp .env.example .env
```

Default backend API URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Start frontend development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Current Features

- Customer storefront layout
- Product catalog page
- Product detail page
- Login page
- Register page
- Cart page with quantity update, remove, clear, and checkout navigation
- Checkout page with address creation, address selection, payment method, notes, and order placement
- Account dashboard with profile, stats, recent orders, admin note, and address management
- Wishlist page with saved products and removal
- Order history page
- Order detail page with items, payment summary, eligible cancel action, and delivered-order review form
- API client connected to backend endpoints
- Token storage after login/register
- Demo product fallback when backend is not running

## Styling

The frontend uses Tailwind CSS through the official Vite plugin.

Tailwind setup files:

- `vite.config.js` uses `@tailwindcss/vite`.
- `src/index.css` imports Tailwind and defines reusable component classes with `@apply`.

Style rule for next frontend work:

- Use Tailwind utility classes or reusable Tailwind component classes.
- Do not add large custom CSS blocks for new pages.
- Prefer shared UI patterns for buttons, cards, forms, notices, and layouts.

## Backend Connection

Run backend first from the backend folder:

```bash
npm run dev
```

Or with Docker from the backend folder:

```bash
npm run docker:up
```

Then run frontend from this folder:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```http
http://localhost:5173
```

## Account Dashboard

Current account flow:

1. Logged-in users see profile summary and account stats.
2. Customers can view saved shipping addresses.
3. Customers can create a new shipping address.
4. Customers can set a default address.
5. Customers can delete saved addresses.
6. Recent orders appear on the account dashboard.
7. Admin users see an admin account note until a dedicated admin dashboard is built.

## Reviews

Current review flow:

1. Product detail shows approved product reviews.
2. Delivered order detail shows review forms for purchased products.
3. Customer selects rating from 1 to 5.
4. Customer writes an optional comment.
5. Review is submitted to the backend as pending approval.
6. Approved reviews appear publicly on product detail.

## Wishlist And Orders

Current authenticated customer flow:

1. Add a backend product to wishlist from product detail.
2. View saved products at `/wishlist`.
3. Remove saved products from wishlist.
4. View purchase history at `/orders`.
5. Open order detail at `/orders/:id`.
6. Cancel eligible orders when backend status allows it.

## Customer Checkout Flow

Current browser flow:

1. Register or login.
2. Browse products.
3. Open product detail.
4. Select a variant when backend data includes variants.
5. Add item to cart.
6. Update quantity, remove item, or clear cart.
7. Go to checkout.
8. Create or select shipping address.
9. Select payment method.
10. Place order through the backend checkout endpoint.

## Next Frontend Tasks

1. Add admin dashboard foundation.
2. Add frontend UI polish and responsive pass.
