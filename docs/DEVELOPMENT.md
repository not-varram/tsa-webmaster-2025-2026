# Development Guide

This guide covers everything you need to know to develop WTSA Coalesce locally.

## Prerequisites

- **Node.js** 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm))
- **pnpm** (recommended) or npm
- **PostgreSQL** 14+ (local install or Docker)
- **Git**

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tsa-webmaster-2025-2026
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database connection string
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/wtsa_coalesce"

# JWT secret (minimum 32 characters)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-chars"

# Optional: Node environment
NODE_ENV="development"
```

### 4. Database Setup

**Option A: Local PostgreSQL**

```bash
# Create database
createdb wtsa_coalesce

# Or using psql
psql -c "CREATE DATABASE wtsa_coalesce;"
```

**Option B: Docker**

```bash
docker run --name wtsa-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=wtsa_coalesce \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### 5. Initialize Database

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
npx prisma db push

# Seed with demo data (optional but recommended)
pnpm db:seed
```

### 6. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Test Accounts

After running the seed script:

| Role | Email | Password |
|------|-------|----------|
| WTSA Admin | admin@wtsa.org | password123 |
| Chapter Admin (LWHS) | admin@lwhs.edu | password123 |
| Chapter Admin (Tesla) | admin@teslastem.edu | password123 |
| Verified Student | student@lwhs.edu | password123 |

## Development Workflow

### Running Commands

```bash
# Development server with hot reload
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Production build
pnpm build

# Start production server
pnpm start
```

### Database Commands

```bash
# Generate Prisma client (after schema changes)
pnpm db:generate

# Push schema changes to database
npx prisma db push

# Reset database and re-seed
npx prisma db push --force-reset && pnpm db:seed

# Open Prisma Studio (database GUI)
npx prisma studio

# Create a migration (for production)
npx prisma migrate dev --name migration_name
```

## Project Structure

```
tsa-webmaster-2025-2026/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth route group (no layout)
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── api/                 # API routes
│   ├── dashboard/           # Admin dashboards
│   └── [page]/              # Public pages
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── cards/               # Card components
│   ├── forms/               # Form components
│   ├── layout/              # Layout components
│   └── posts/               # Community board
├── lib/                     # Shared utilities
│   ├── auth.ts              # Authentication helpers
│   ├── db.ts                # Prisma client singleton
│   └── utils.ts             # General utilities
├── prisma/                  # Database
│   ├── schema.prisma        # Data model
│   └── seed.ts              # Seed script
├── public/                  # Static files
└── docs/                    # Documentation
```

## Code Style

### TypeScript

- Enable strict mode (already configured)
- Use interfaces for component props
- Avoid `any` type
- Use meaningful variable names

### React Components

**Server Components** (default):
```tsx
// app/resources/page.tsx
export default async function ResourcesPage() {
  const data = await prisma.resource.findMany()
  return <ResourceList resources={data} />
}
```

**Client Components** (for interactivity):
```tsx
// components/MyComponent.tsx
'use client'

import { useState } from 'react'

export function MyComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Styling with Tailwind

Use utility classes directly:
```tsx
<button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
  Click me
</button>
```

Use `cn()` helper for conditional classes:
```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)}>
```

### API Routes

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const data = await prisma.example.findMany()
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Adding New Features

### 1. Database Changes

1. Update `prisma/schema.prisma`
2. Run `pnpm db:generate`
3. Run `npx prisma db push` (development) or `npx prisma migrate dev` (production)
4. Update seed script if needed

### 2. New API Route

1. Create route file in `app/api/[route]/route.ts`
2. Implement GET, POST, PATCH, DELETE handlers
3. Add authentication/authorization checks
4. Use Zod for input validation
5. Document in `docs/API.md`

### 3. New Page

1. Create page file in `app/[route]/page.tsx`
2. Use Server Components for data fetching
3. Extract interactive parts to Client Components
4. Add to navigation if needed

### 4. New Component

1. Create component in appropriate `components/` subdirectory
2. Use TypeScript interface for props
3. Export from component file
4. Consider Server vs Client component needs

## Debugging

### Prisma Debug Logging

```bash
# Enable query logging
DEBUG="prisma:query" pnpm dev
```

### Next.js Debug Mode

```bash
# Enable verbose logging
NODE_OPTIONS='--inspect' pnpm dev
```

### Browser DevTools

- React DevTools extension for component inspection
- Network tab for API request debugging
- Application tab for cookie inspection

## Common Issues

### "Prisma Client not generated"

```bash
pnpm db:generate
```

### "Database connection failed"

1. Check PostgreSQL is running
2. Verify `DATABASE_URL` in `.env`
3. Ensure database exists

### "JWT_SECRET error"

Ensure `JWT_SECRET` is at least 32 characters in `.env`.

### "Module not found"

```bash
# Clear Next.js cache
rm -rf .next
pnpm dev
```

### Prisma Studio Not Opening

```bash
# Ensure database is accessible
npx prisma db push
npx prisma studio
```

## Testing

Currently, the project doesn't include automated tests. When adding tests:

1. Use Jest + React Testing Library for component tests
2. Use Supertest for API route tests
3. Mock Prisma for database tests

## Performance Tips

1. Use Server Components for non-interactive content
2. Implement loading states with `loading.tsx`
3. Use `revalidate` for ISR on static pages
4. Optimize images with `next/image`
5. Lazy load heavy components with `dynamic()`

## Git Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit with meaningful messages
3. Push and create pull request
4. Request review from team members
5. Merge after approval

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for JWT signing (min 32 chars) |
| `NODE_ENV` | No | `development` or `production` |
