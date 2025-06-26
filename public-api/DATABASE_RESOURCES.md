# Database Resource Management

This directory contains scripts and configuration for managing the database resources used by the TodoApp Generator.

## Quick Start

To populate your database with all the resource data:

```bash
# First, make sure your database is set up and migrated
npm run prisma:migrate

# Then seed the database with all resources
npm run db:seed
```

## Available Scripts

### Seeding Commands

- `npm run seed` - Run the seed script directly with tsx
- `npm run db:seed` - Run the seed script via Prisma (recommended)

### Database Management Commands

- `npm run db:manage reset` - Clear all resource tables
- `npm run db:manage check` - Display current table counts
- `npm run db:manage status` - Show table status (same as check)

## Resource Categories

The seeding system populates the following tables:

### 1. Languages (Backend Languages)

- **Free Tier (0)**: Node.js, Python (FastAPI)
- **Premium Tier 1**: Java (Spring Boot), C# (.NET), PHP (Laravel)
- **Premium Tier 2**: Go (Gin)

### 2. Backend Architectures

- **Free Tier (0)**: MVC
- **Premium Tier 1**: Clean Architecture, Hexagonal, Layered Architecture
- **Premium Tier 2**: Microservices

### 3. Databases

- **Free Tier (0)**: SQLite
- **Premium Tier 2**: PostgreSQL, MySQL, MongoDB, Redis

### 4. Frontend Architectures

- **Free Tier (0)**: MVP (Templates serveur), SPA (Single Page App)
- **Premium Tier 1**: SSR (Server Side Rendering)

### 5. Frontend Frameworks

- **Free Tier (0)**: React
- **Premium Tier 1**: Vue.js, Angular, Svelte
- **Premium Tier 2**: Next.js, Nuxt.js

### 6. Frontend Stylings

- **Free Tier (0)**: Tailwind CSS, Bootstrap, CSS Vanilla
- **Premium Tier 1**: Material UI, Chakra UI

## Premium Tiers

The resources are organized into different premium tiers:

- **Tier 0 (Free)**: Basic options available to all users
- **Tier 1 (Premium)**: Advanced options for premium users
- **Tier 2 (Premium+)**: Professional options for premium+ users

## Database Schema

Each resource table follows the same structure:

```sql
CREATE TABLE resource_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  required_tier INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  code VARCHAR(10) UNIQUE NOT NULL
);
```

## Adding New Resources

To add new resources, edit the `/prisma/seed.ts` file and add your new entries to the appropriate array. Then run:

```bash
npm run db:manage reset
npm run db:seed
```

## Environment Setup

Make sure you have the following environment variables set:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
```

## Troubleshooting

### Database Connection Issues

If you're having trouble connecting to the database:

1. Ensure PostgreSQL is running
2. Check your `DATABASE_URL` environment variable
3. Verify database credentials

### Seeding Failures

If seeding fails:

1. Check that all migrations are applied: `npm run prisma:migrate`
2. Verify database connectivity
3. Check for constraint violations in the data

### Resetting Everything

To completely reset and reseed:

```bash
npm run db:manage reset
npm run db:seed
npm run db:manage check
```

## API Endpoints

Once seeded, the following API endpoints will return the resource data:

- `GET /api/v1/languages` - All programming languages
- `GET /api/v1/backend-architectures` - All backend architectures
- `GET /api/v1/databases` - All database options
- `GET /api/v1/frontend-architectures` - All frontend architectures
- `GET /api/v1/frontend-frameworks` - All frontend frameworks
- `GET /api/v1/frontend-stylings` - All styling options

Each endpoint supports query parameters:

- `?active=true` - Filter by active status
- `?tier=0` - Filter by required tier level
