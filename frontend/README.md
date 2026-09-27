# PhoneHub Frontend

React + Vite frontend for the PhoneHub e-commerce project. This app is separate from the backend and connects to the backend REST API.

## Tech Stack

- React
- Vite
- React Router
- Lucide React icons

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
- Cart page foundation
- Account page foundation
- API client connected to backend endpoints
- Token storage after login/register
- Demo product fallback when backend is not running

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

## Next Frontend Tasks

1. Add real cart quantity update and remove actions.
2. Add checkout pages with address selection.
3. Add wishlist integration.
4. Add order history page.
5. Add review submission flow.
6. Add admin dashboard later.
