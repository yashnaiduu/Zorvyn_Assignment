# Zorvyn — Enterprise Finance Backend

Production-grade Finance Data Processing and Access Control API built with NestJS, Prisma, and PostgreSQL.

## Architecture

```
Controller → Service → Prisma (Repository) → PostgreSQL
```

Clean layered architecture following SOLID principles:

- **Controllers** — HTTP routing, request validation (via DTOs), Swagger documentation
- **Services** — Business logic, transaction management, audit logging
- **Prisma** — Database access, schema management, migrations
- **Guards** — JWT authentication, permission-based RBAC
- **Interceptors** — Standardized response envelope
- **Filters** — Global exception handling with structured error responses

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript (strict mode) |
| Framework | NestJS 11 |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens), Passport |
| Validation | class-validator + class-transformer |
| Docs | Swagger / OpenAPI |
| Rate Limiting | @nestjs/throttler |

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

## Setup

```bash
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Run database migrations
npx prisma migrate dev

# Seed the database (creates admin/analyst/viewer + sample records)
npx prisma db seed

# Start in development mode
npm run start:dev
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing (app fails if missing) |
| `PORT` | No | Server port (default: 3000) |
| `CORS_ORIGIN` | No | Comma-separated allowed origins (default: http://localhost:3000) |

## API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register a new user (rate limited: 3/min) |
| POST | `/login` | No | Login and receive tokens |
| POST | `/refresh` | No | Refresh access token |
| POST | `/logout` | JWT | Invalidate refresh token |

### Users (`/api/v1/users`)

| Method | Endpoint | Permission | Description |
|---|---|---|---|
| GET | `/` | `user:manage` | List all users (paginated) |
| PATCH | `/:id/role` | `user:manage` | Update user role |
| PATCH | `/:id/active` | `user:manage` | Activate/deactivate user |

### Financial Records (`/api/v1/records`)

| Method | Endpoint | Permission | Description |
|---|---|---|---|
| POST | `/` | `record:create` | Create a record |
| GET | `/` | `record:read` | List records (filtered, paginated, ownership-scoped) |
| GET | `/:id` | `record:read` | Get a single record |
| PATCH | `/:id` | `record:update` | Update a record |
| DELETE | `/:id` | `record:delete` | Delete a record |

### Analytics (`/api/v1/analytics`)

| Method | Endpoint | Permission | Description |
|---|---|---|---|
| GET | `/summary` | `analytics:read` | Total income, expenses, net balance |
| GET | `/breakdown` | `analytics:read` | Category-wise breakdown |
| GET | `/trends` | `analytics:read` | Monthly trends (DB-level aggregation) |
| GET | `/recent` | `analytics:read` | Recent transactions |

### Health (`/api/v1/health`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | No | Health check (DB connectivity) |

## RBAC Permission Matrix

| Permission | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| `analytics:read` | ✅ | ✅ | ✅ |
| `record:read` | ❌ | ✅ | ✅ |
| `record:create` | ❌ | ❌ | ✅ |
| `record:update` | ❌ | ❌ | ✅ |
| `record:delete` | ❌ | ❌ | ✅ |
| `user:manage` | ❌ | ❌ | ✅ |

Non-ADMIN users can only access their own records. ADMINs have global access.

## Project Structure

```
src/
├── main.ts                          # Bootstrap, Swagger, CORS, pipes
├── app.module.ts                    # Root module (Throttler, Config, all modules)
├── prisma/                          # PrismaService + PrismaModule
├── common/
│   ├── decorators/                  # @Permissions(), @Roles()
│   ├── filters/                     # GlobalExceptionFilter
│   ├── guards/                      # JwtAuthGuard, PermissionsGuard
│   ├── interceptors/                # TransformInterceptor (response envelope)
│   └── interfaces/                  # AuthenticatedRequest, JwtPayload
└── modules/
    ├── auth/                        # Register, login, refresh, logout
    ├── users/                       # User management (CRUD, roles)
    ├── records/                     # Financial records (CRUD, filtering)
    ├── analytics/                   # Dashboard & aggregation APIs
    ├── audit/                       # Transactional audit logging
    └── health/                      # Health check endpoint
```

## Swagger Documentation

Available at `http://localhost:3000/api/docs` when the server is running.

## Seed Accounts

| Email | Password | Role |
|---|---|---|
| admin@zorvyn.com | admin123 | ADMIN |
| analyst@zorvyn.com | analyst123 | ANALYST |
| viewer@zorvyn.com | viewer123 | VIEWER |

## Scripts

```bash
npm run build          # Production build
npm run start:dev      # Development with hot reload
npm run test           # Run unit tests
npm run test:cov       # Test coverage
npm run lint           # ESLint
```

## License

UNLICENSED — Private project.
