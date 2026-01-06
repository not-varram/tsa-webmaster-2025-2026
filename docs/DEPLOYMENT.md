# Deployment Guide

This guide covers deploying WTSA Coalesce to production environments.

## Deployment Options

| Platform | Difficulty | Best For |
|----------|------------|----------|
| Vercel | Easy | Quick deployment, serverless |
| Docker | Medium | Self-hosted, full control |
| Railway | Easy | Database + app hosting |
| Render | Easy | Alternative to Vercel |

---

## Option 1: Vercel (Recommended)

Vercel is the easiest option as Next.js is built by Vercel.

### Prerequisites

- Vercel account
- PostgreSQL database (Vercel Postgres, Neon, Supabase, etc.)

### Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import Project on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Select the repository

3. **Configure Environment Variables**
   Add these in Vercel project settings:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-production-secret-minimum-32-chars
   ```

4. **Deploy**
   - Vercel auto-deploys on push to main
   - Build command: `pnpm build` (auto-detected)
   - Output: `.next` directory

5. **Run Database Migrations**
   ```bash
   # In Vercel CLI or local with production DATABASE_URL
   npx prisma db push
   ```

### Vercel-Specific Settings

Add to `vercel.json` if needed:
```json
{
  "buildCommand": "pnpm db:generate && pnpm build",
  "installCommand": "pnpm install"
}
```

---

## Option 2: Docker

The project includes Docker support for self-hosted deployments.

### Files Included

- `Dockerfile` — Multi-stage build for production
- `docker-compose.yml` — Quick deployment setup

### Build and Run

```bash
# Build image
docker build -t wtsa-coalesce .

# Run with environment variables
docker run -d \
  --name wtsa-coalesce \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  wtsa-coalesce
```

### Using Docker Compose

Create a complete `docker-compose.yml`:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/wtsa
      JWT_SECRET: your-super-secret-jwt-key-minimum-32-chars
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: wtsa
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

Run:
```bash
docker-compose up -d
```

### Database Migrations in Docker

```bash
# Run migrations in the container
docker exec wtsa-coalesce npx prisma db push

# Or seed the database
docker exec wtsa-coalesce npx prisma db seed
```

---

## Option 3: Railway

Railway provides easy deployment with integrated PostgreSQL.

### Steps

1. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub repo

2. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway auto-generates `DATABASE_URL`

3. **Configure Environment**
   Add `JWT_SECRET` in project settings.

4. **Deploy**
   Railway auto-deploys from main branch.

5. **Run Migrations**
   ```bash
   # In Railway CLI
   railway run npx prisma db push
   railway run npx prisma db seed
   ```

---

## Database Setup

### Production Database Options

1. **Vercel Postgres** — Integrated with Vercel
2. **Neon** — Serverless PostgreSQL, free tier available
3. **Supabase** — Postgres with extras, generous free tier
4. **PlanetScale** — MySQL alternative (requires schema changes)
5. **Railway PostgreSQL** — Simple, integrated with Railway
6. **DigitalOcean Managed Database** — Production-grade

### Connection String Format

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

### Initial Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to production database
DATABASE_URL="your-production-url" npx prisma db push

# Optionally seed with demo data
DATABASE_URL="your-production-url" npx prisma db seed
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | JWT signing secret (32+ chars) | `super-secret-key...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |

### Generating a Secure JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

---

## Build Process

The production build process:

1. **Install Dependencies**
   ```bash
   pnpm install --frozen-lockfile
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Build Next.js**
   ```bash
   pnpm build
   ```

4. **Output**
   - `.next/standalone` — Minimal Node.js server
   - `.next/static` — Static assets
   - `public/` — Public files

---

## Post-Deployment

### Health Check

Verify the application is running:
```bash
curl https://your-domain.com/api/auth/me
# Should return: {"user":null}
```

### Database Check

Verify database connectivity:
```bash
curl https://your-domain.com/api/chapters
# Should return chapter data
```

### Create Admin Account

If not using seed data, create admin via database:

```sql
-- In your database client
INSERT INTO "User" (id, email, password, name, role, "verificationStatus", "createdAt", "updatedAt")
VALUES (
  'admin-id',
  'admin@wtsa.org',
  '$2a$12$...',  -- bcrypt hash of password
  'WTSA Administrator',
  'ADMIN',
  'APPROVED',
  NOW(),
  NOW()
);
```

Or use the seed script with production DATABASE_URL.

---

## SSL/HTTPS

### Vercel/Railway/Render
SSL is automatic.

### Self-Hosted (Docker)
Use a reverse proxy like:
- **Nginx** with Let's Encrypt
- **Caddy** (automatic SSL)
- **Traefik** (Docker-native)

Example Caddy configuration:
```
your-domain.com {
  reverse_proxy localhost:3000
}
```

---

## Monitoring

### Recommended Tools

1. **Vercel Analytics** — Built-in for Vercel deployments
2. **Sentry** — Error tracking
3. **LogTail/Papertrail** — Log aggregation
4. **UptimeRobot** — Uptime monitoring

### Health Endpoint

Add a health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```

---

## Backup & Recovery

### Database Backups

1. **Automated** — Most managed databases have automatic backups
2. **Manual** — Use `pg_dump` for PostgreSQL
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

### Restore

```bash
psql $DATABASE_URL < backup.sql
```

---

## Scaling

### Vercel
- Automatic scaling
- Edge functions for global performance

### Docker/Self-Hosted
- Horizontal scaling with load balancer
- Use connection pooling (PgBouncer)
- Consider read replicas for database

---

## Troubleshooting

### Build Failures

1. Check Node.js version matches (`18+`)
2. Ensure all dependencies are in `package.json`
3. Verify Prisma schema is valid
4. Check for TypeScript errors: `pnpm type-check`

### Database Connection Issues

1. Verify `DATABASE_URL` format
2. Check SSL mode (`?sslmode=require` for most cloud providers)
3. Ensure IP whitelist includes deployment server
4. Test connection locally first

### Runtime Errors

1. Check application logs
2. Verify environment variables are set
3. Ensure database migrations ran
4. Check for missing dependencies

### Performance Issues

1. Enable Next.js production mode
2. Use CDN for static assets
3. Implement caching headers
4. Optimize database queries
