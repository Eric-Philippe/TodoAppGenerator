# Public API

A TypeScript Express API with Swagger documentation and Prisma ORM for the TodoApp Generator.

## Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast, unopinionated web framework
- **Prisma ORM**: Type-safe database access
- **Swagger/OpenAPI**: Comprehensive API documentation
- **CORS**: Cross-origin resource sharing enabled
- **Security**: Helmet.js for security headers
- **Logging**: Morgan for HTTP request logging

## API Endpoints

### Available Resources

- **Languages** (`/api/v1/languages`)
- **Backend Architectures** (`/api/v1/backend-architectures`)
- **Databases** (`/api/v1/databases`)
- **Frontend Architectures** (`/api/v1/frontend-architectures`)
- **Frontend Frameworks** (`/api/v1/frontend-frameworks`)
- **Frontend Stylings** (`/api/v1/frontend-stylings`)

### Endpoint Patterns

For each resource, the following endpoints are available:

- `GET /api/v1/{resource}` - List all items with optional filtering
- `GET /api/v1/{resource}/{id}` - Get specific item by UUID
- `GET /api/v1/{resource}/code/{code}` - Get specific item by code

### Query Parameters

- `active`: Filter by active status (`true`/`false`)
- `tier`: Filter by required tier (`0` = free, `1+` = premium)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your database connection string
   ```

3. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

4. Run database migrations (if needed):
   ```bash
   npm run prisma:migrate
   ```

### Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Production

Build and start the production server:

```bash
npm run build
npm start
```

## API Documentation

Once the server is running, visit `http://localhost:3001/api-docs` to access the interactive Swagger documentation.

## Health Check

Check API health at `GET /health`

## Database Schema

The API connects to the TodoApp configuration database with the following tables:

- `languages` - Available programming languages
- `backend_architectures` - Backend architecture options
- `databases` - Database options
- `frontend_architectures` - Frontend architecture options
- `frontend_frameworks` - Frontend framework options
- `frontend_stylings` - Frontend styling options

Each table includes:

- `id` (UUID) - Primary key
- `name` - Display name
- `description` - Optional description
- `required_tier` - Access tier (0 = free, 1+ = premium)
- `is_active` - Active status
- `created_at` - Creation timestamp
- `code` - Unique identifier code

## Error Handling

The API returns structured error responses:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:

- `200` - Success
- `404` - Resource not found
- `500` - Internal server error
