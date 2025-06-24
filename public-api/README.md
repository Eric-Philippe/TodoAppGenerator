# Public API

This is the public-facing REST API for the Todo Application, built with Node.js, Express, and TypeScript.

## Features

- **RESTful API** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** database integration with TypeORM
- **CORS** enabled for cross-origin requests
- **Environment configuration** with dotenv
- **Swagger/OpenAPI 3.0** documentation
- **Docker** support for containerization

## Getting Started

### Prerequisites

- Node.js 16+
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
# Edit .env with your database configuration
```

3. Build the application:

```bash
npm run build
```

4. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Documentation

### Swagger UI

Interactive API documentation is available at:

- **URL**: `http://localhost:3000/api-docs`
- **Features**:
  - Browse all available endpoints
  - Test API endpoints directly in the browser
  - View request/response schemas
  - Download OpenAPI specification

### OpenAPI Specification

Raw OpenAPI 3.0 specification available at:

- **URL**: `http://localhost:3000/api-docs.json`

For detailed documentation guidelines, see [docs/swagger.md](./docs/swagger.md)

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run typeorm` - Run TypeORM schema synchronization

## API Endpoints

### Base URL

- Development: `http://localhost:3000/api`

### Available Endpoints

#### API Information

- `GET /api/v1` - Get API version and welcome message

#### Health Check

- `GET /api/v1/ping` - Health check endpoint (returns "pong")

More endpoints will be documented as they are added. Check the Swagger documentation for the most up-to-date API reference.

## Project Structure

```
src/
├── config/
│   └── swagger.ts          # Swagger/OpenAPI configuration
├── routes/
│   ├── routes.ts           # Main router configuration
│   └── v1/
│       ├── routesV1.ts     # Version 1 API routes
│       └── ping/
│           ├── pingRouter.ts
│           └── getPing.ts
├── data-source.ts          # TypeORM data source configuration
├── env.ts                  # Environment variables
├── Events.ts               # Application events
└── server.ts               # Main application entry point
```

## Environment Variables

| Variable      | Description       | Default     |
| ------------- | ----------------- | ----------- |
| `PORT`        | Server port       | `3000`      |
| `DB_HOST`     | Database host     | `localhost` |
| `DB_PORT`     | Database port     | `5432`      |
| `DB_NAME`     | Database name     | -           |
| `DB_USER`     | Database user     | -           |
| `DB_PASSWORD` | Database password | -           |

## Docker Support

### Development

```bash
docker build -f Dockerfile.dev -t public-api:dev .
docker run -p 3000:3000 public-api:dev
```

### Production

```bash
docker build -f Dockerfile -t public-api:prod .
docker run -p 3000:3000 public-api:prod
```

## Contributing

1. **Adding New Endpoints**

   - Create route handlers in appropriate directories
   - Add Swagger documentation using JSDoc comments
   - Update route configurations
   - Test endpoints using Swagger UI

2. **Code Style**

   - Use TypeScript for all new code
   - Follow existing code structure and naming conventions
   - Include proper error handling

3. **Documentation**
   - Document all new endpoints with Swagger
   - Update README when adding major features
   - Include examples in API documentation

## Dependencies

### Runtime Dependencies

- `express` - Web framework
- `typeorm` - ORM for database operations
- `pg` - PostgreSQL client
- `cors` - CORS middleware
- `dotenv` - Environment variable loading
- `swagger-jsdoc` - OpenAPI spec generation
- `swagger-ui-express` - Swagger UI serving

### Development Dependencies

- `typescript` - TypeScript compiler
- `ts-node-dev` - Development server with hot reload
- `@types/*` - TypeScript type definitions

## License

This project is licensed under the ISC License.
