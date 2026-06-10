# Foody Order REST API

A RESTful food ordering API built with Express, Prisma, and PostgreSQL. Supports user registration, product browsing with search/filtering, cart management, order checkout, payment processing (Midtrans), reviews, ratings, likes, and guest checkout.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 4.x |
| ORM | Prisma 5.x |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Logging | Winston |
| Docs | Swagger UI (OpenAPI 3.0) |
| Testing | Jest + Supertest + @faker-js/faker |
| Payments | Midtrans Snap |
| CI | GitHub Actions |

## Features

- **User Auth** -- Register, login with JWT; profile management with avatar and address
- **Guest Checkout** -- Place orders without registering via guest UUID
- **Products** -- Browse with cursor/page pagination, search by name, filter by category and tag, best-rated endpoint
- **Cart** -- Add items, update quantities, clear cart, cart validation
- **Orders** -- Create, list, view detail, cancel, checkout (payment gateway integration)
- **Payments** -- Midtrans Snap support with webhook handling for async confirmation
- **Reviews & Likes** -- Rate and review products; like/unlike products (unique per user)
- **Shipments** -- Address, city, state, postal code, delivery tracking with status
- **Feedback** -- Submit feedback as authenticated user or guest
- **Swagger Docs** -- Interactive API documentation at `/api/docs`

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- (Optional) Midtrans account for payment processing

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd foody-order-rest-api
npm install
```

### 2. Environment variables

Create a `.env` file at the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/food_app?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/food_app?schema=public"
SHADOW_DATABASE_URL="postgresql://user:password@localhost:5432/food_app_shadow?schema=public"
JWT_SECRET_KEY="your-secret-key"
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
FRONT_END_BASE_URL="http://localhost:3000"
```

### 3. Database setup

```bash
npx prisma migrate deploy
npx prisma db seed
```

The seed script populates the database with:
- 22 users (2 named + 20 faker-generated, all with password `rahasia123`)
- 2 categories (Food, Drink)
- 26 tags
- 24 products with random likes and reviews

### 4. Run the server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server listens on `http://localhost:4000` by default.

### 5. View API docs

Open `http://localhost:4000/api/docs` in your browser.

### 6. Run tests

```bash
npm test
```

Tests run via Jest with babel-jest transform and a 60-second timeout. The CI pipeline (`push`/`pr` to `main`) runs the full test suite against a PostgreSQL container.

## Project Structure

```
foody-order-rest-api/
├── api/
│   └── index.js              # Entry point -- starts Express server
├── prisma/
│   ├── schema.prisma         # 14 models: User, Profile, Product, Category,
│   │                         #   Tag, TagOnProduct, Cart, CartItem, Order,
│   │                         #   OrderItem, Payment, Shipment, Review,
│   │                         #   LikeOnProduct, Feedback
│   ├── seed.js               # Database seeder
│   └── migrations/           # Prisma migrations
├── src/
│   ├── app/
│   │   ├── database.js       # Prisma client with Winston event logging
│   │   ├── logging.js        # Winston logger (JSON console transport)
│   │   └── web.js            # Express app setup (CORS, JSON, Swagger, routes)
│   ├── controllers/          # 12 controllers (thin, delegate to services)
│   ├── services/             # 12 service files (business logic + Prisma queries)
│   ├── middleware/
│   │   ├── auth-middleware.js    # JWT Bearer token verification
│   │   ├── guest-middleware.js   # Token or guest UID verification
│   │   └── error-middleware.js   # Global error handler (Zod, ResponseError, 500)
│   ├── routes/
│   │   ├── api.js            # Authenticated routes (user, cart, reviews, likes)
│   │   ├── public-api.js     # Public routes (login, register, products, orders, payments)
│   │   └── webhook.js        # Payment webhook
│   ├── plugin/
│   │   └── midtrans.js       # Midtrans Snap client
│   ├── errors/
│   │   └── response-error.js # Custom error class with HTTP status
│   ├── utils/
│   │   └── index.js          # JWT verify, random ID generator, price calculator
│   └── docs/
│       └── api-spec.yaml     # Full OpenAPI 3.0 specification
├── __test__/                 # Jest test suite (10 test files)
├── .github/workflows/ci.yml  # GitHub Actions CI
├── package.json
├── jest.config.js
├── babel.config.json
└── .gitignore
```

## API Routes Summary

### Public Routes (no auth required)

| Method | Path | Description |
|---|---|---|
| POST | `/api/users` | Register new user |
| POST | `/api/users/login` | Login, returns JWT |
| GET | `/api/users/guest` | Create a guest UUID |
| GET | `/api/products` | List products (cursor pagination, search, filter) |
| GET | `/api/products/search` | Search products (page pagination, `?all=true` for all) |
| GET | `/api/products/best-rated` | Best rated products by category |
| GET | `/api/products/:slug` | Product detail by slug |
| GET | `/api/tags` | List all tags |
| GET | `/api/categories` | List all categories |

### Guest/Authenticated Routes (`guestMiddleware`)

| Method | Path | Description |
|---|---|---|
| POST | `/api/carts/validate` | Validate cart items |
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/:orderId` | Order detail |
| POST | `/api/orders/checkout` | Checkout (initiate payment) |
| POST | `/api/orders/:orderId/cancel` | Cancel order |
| GET | `/api/payment/:transactionId` | Payment status |
| POST | `/api/feedback` | Submit feedback |

### Authenticated Routes (`authMiddleware` -- Bearer token required)

| Method | Path | Description |
|---|---|---|
| GET | `/api/users/current` | Get current user profile |
| PATCH | `/api/users/current` | Update profile (name, address, phone) |
| GET | `/api/carts` | Get user cart |
| POST | `/api/carts/clear` | Clear cart |
| GET | `/api/carts/items` | List cart items |
| GET | `/api/carts/items/:productSlug` | Get specific cart item |
| PUT | `/api/carts/items` | Add/update cart item |
| DELETE | `/api/carts/items/:productSlug` | Remove cart item |
| POST | `/api/products/reviews` | Create review |
| PUT | `/api/products/reviews` | Update review |
| POST | `/api/products/:productSlug/like` | Like a product |
| DELETE | `/api/products/:productSlug/like` | Unlike a product |

### Webhook

| Method | Path | Description |
|---|---|---|
| POST | `/api/webhook` | Payment gateway webhook callback |

## Authentication

Most routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

Guest-accessible routes use `guestMiddleware` which accepts either a valid JWT token or a `guest_uid` query parameter (UUID format):

```
GET /api/orders?guest_uid=6429c8d9-2dee-4677-9364-9aca60a303d0
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Prisma connection pool URL |
| `DIRECT_URL` | Yes | Direct database URL (bypass pool) |
| `SHADOW_DATABASE_URL` | Yes | Shadow DB for Prisma migrations |
| `JWT_SECRET_KEY` | Yes | Secret for JWT signing |
| `MIDTRANS_SERVER_KEY` | No | Midtrans server key (sandbox default) |
| `FRONT_END_BASE_URL` | No | Frontend base URL (used by CI/Tools) |

## License

ISC
