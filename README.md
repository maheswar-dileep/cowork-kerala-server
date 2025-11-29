# CoWork Kerala Server

Backend API for CoWork Kerala Admin Panel - Manage coworking spaces, leads, and settings.

## Tech Stack

- **Runtime**: Bun
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## Features

- ✅ Authentication system with JWT
- ✅ Password reset functionality
- ✅ Rate limiting on auth endpoints
- ✅ Repository pattern architecture
- ✅ Type-safe with TypeScript
- ✅ Request validation with Zod
- ✅ Error handling middleware
- ✅ CORS and security headers
- ✅ Admin user seeding

## Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)
- MongoDB (v6.0 or higher)

## Installation

1. Install dependencies:
```bash
bun install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - Set MongoDB connection string
   - Configure JWT secret
   - Set up SMTP for password reset emails (optional)

## Running the Server

### Development Mode (with auto-reload)
```bash
bun dev
```

### Production Mode
```bash
bun start
```

## API Documentation

The API comes with interactive Swagger documentation:

**Access Swagger UI:**
- URL: http://localhost:3000/api-docs
- Features:
  - Interactive API explorer
  - Request/response examples
  - Schema definitions
  - Try out API endpoints directly from the browser

**Swagger JSON:**
- URL: http://localhost:3000/api-docs.json
- Use this for importing into Postman, Insomnia, or other API clients

The Swagger documentation is automatically generated from JSDoc comments in the route files and includes:
- All authentication endpoints
- Request/response schemas
- Authentication requirements
- Error responses

## Database Seeding

Create an initial admin user:
```bash
bun seed
```

Update existing admin password:
```bash
bun seed --update-password
```

Default credentials (from `.env`):
- Email: admin@coworkkerala.com
- Password: Admin@123456

**⚠️ Change the password after first login!**

## API Endpoints

### Authentication

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@coworkkerala.com",
  "password": "Admin@123456"
}
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

#### Forgot Password
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "admin@coworkkerala.com"
}
```

#### Reset Password
```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "NewSecure@Password123"
}
```

### Settings

#### Change Password
```http
PUT /api/v1/settings/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "Admin@123456",
  "newPassword": "NewSecure@Password123"
}
```

## Project Structure

```
src/
├── config/          # Configuration files (database, env)
├── controllers/     # Request handlers
├── middlewares/     # Express middlewares
├── models/          # Mongoose models
├── repositories/    # Data access layer
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── validators/      # Zod validation schemas
├── scripts/         # Utility scripts (seeding, etc.)
└── index.ts         # Application entry point
```

## Repository Pattern

The application follows the repository pattern:

```
Request → Route → Middleware → Controller → Service → Repository → Database
```

- **Repository**: Data access layer (CRUD operations)
- **Service**: Business logic (authentication, JWT, etc.)
- **Controller**: HTTP request/response handling
- **Middleware**: Authentication, validation, error handling

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on sensitive endpoints
- Helmet security headers
- CORS configuration
- Input validation with Zod
- Proper error handling

## Environment Variables

See `.env.example` for all available configuration options.

## Type Checking

Run TypeScript type checking:
```bash
bun type-check
```

## Health Check

```http
GET /health
```

## Additional Resources

- **Interactive Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI Spec (JSON)**: http://localhost:3000/api-docs.json
- **Static API Spec**: `src/apidocs/api-documentation.json`

## License

MIT
