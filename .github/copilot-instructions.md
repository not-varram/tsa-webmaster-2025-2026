# WTSA Community Resource Hub - AI Agent Instructions

## Project Overview

A Next.js 14 (App Router) web application for the 2025-2026 TSA Webmaster competition, enabling Washington TSA chapters to share resources (digital and physical), collaborate through forums, and manage chapter inventories. Currently in enhancement phase adding Clerk authentication and physical resource borrowing system.

## Architecture & Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Authentication:** Clerk (`@clerk/nextjs`) with role-based access control
- **Database:** PostgreSQL via Prisma ORM
- **Styling:** Custom Tailwind theme with WTSA-inspired colors (primary blue, accent red)
- **Icons:** Lucide React

## Critical Patterns & Conventions

### Database & Prisma

**Single Prisma Client Instance** - Always import from `@/lib/db`:
```typescript
import prisma from '@/lib/db';
```

**Database Commands:**
- `npm run db:generate` - Generate Prisma client after schema changes
- `npm run db:push` - Push schema to database (no migrations in dev)
- `npm run db:seed` - Seed with demo data for 3 active chapters

**Active Chapters (Scope Limited):**
- Lake Washington High School
- Redmond High School  
- Juanita High School

### Authentication & Authorization

**Current State:** Clerk is configured but UserRole type import issues exist in `lib/auth.ts` (needs fixing).

**Auth Helper Functions** (`lib/auth.ts`):
```typescript
await getCurrentUser()        // Get DB user with Clerk sync
await isWTSAAdmin()           // Check WTSA admin (email@varram.me)
await isChapterAdmin(id?)     // Check chapter admin permissions
await syncClerkUserToDatabase() // Sync Clerk user to DB
```

**User Roles Enum** (in Prisma):
- `PUBLIC` - Unauthenticated (read-only)
- `STUDENT` - Forum access, resource viewing
- `ADVISOR` - Chapter admin capabilities
- `ADMIN` - WTSA admin (full access)

**Middleware** (`middleware.ts`):
- Most routes are public (resources, chapters, events, forum)
- Protected routes will need explicit handling

### Component & Styling Patterns

**Component Structure:**
```
components/
├── ui/           # Base components (Button, Card)
├── cards/        # Domain-specific cards (ResourceCard, ChapterCard)
├── layout/       # Header, Footer
├── forms/        # SearchBar and form components
└── resources/    # Client components with interactivity
```

**Button Variants:**
```typescript
<Button variant="primary|secondary|outline|ghost" size="sm|md|lg">
```

**Card Pattern:**
```typescript
import { Card, CardBody } from '@/components/ui/Card';
<Card hoverable><CardBody>...</CardBody></Card>
```

**Styling with `cn()` utility:**
```typescript
import { cn } from '@/lib/utils';
className={cn('base-classes', conditionalClass && 'active-classes', className)}
```

**Custom Color Palette:**
- `primary-*` - Blue (WTSA brand)
- `accent-*` - Red (energy, action)
- `neutral-*` - Grays

### Data Fetching & Serialization

**Server Components (Default)** - Fetch data directly:
```typescript
export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({
    include: { chapter: { select: { id: true, name: true } } },
    orderBy: [{ highlighted: 'desc' }, { createdAt: 'desc' }]
  });
  
  // ALWAYS serialize dates before passing to client components
  const serialized = resources.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString()
  }));
  
  return <ClientComponent initialData={serialized} />;
}
```

**Revalidation:** Use `export const revalidate = 1800;` (30 min) for data pages.

### API Routes

**Pattern:** `app/api/[feature]/route.ts`

**Example Structure:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate required fields
    if (!body.field) {
      return NextResponse.json({ error: 'Missing field' }, { status: 400 });
    }
    const result = await prisma.model.create({ data: body });
    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### Physical vs Digital Resources

**Resource Types:**
- Digital: `TEMPLATE`, `VIDEO`, `WORKSHOP`, `GUIDE`, `TOOL`, `EVENT`, `SERVICE`
- Physical: Set `isPhysical: true` + add `quantity`, `condition`, `location`, `availableDate`

**Request Workflow:**
1. Chapter requests resource via `ResourceRequest`
2. Status: `PENDING` → `APPROVED` → `BORROWED` → `RETURNED`
3. Owning chapter approves/rejects requests

## Current Development State

**Completed:**
- ✅ Prisma schema with Forum, ResourceRequest, physical resources
- ✅ Clerk middleware and auth utilities
- ✅ Root layout wrapped in ClerkProvider

**In Progress/Needs Fixing:**
- ❌ `lib/auth.ts` has UserRole type import issues
- 🚧 Sign-in/sign-up pages not created
- 🚧 Chapter Admin Dashboard (`/dashboard/chapter`)
- 🚧 WTSA Admin Dashboard (`/dashboard/wtsa`)
- 🚧 Student Forum (`/forum/*`)

**Key Files to Review Before Changes:**
- `ENHANCEMENT_STATUS.md` - Current progress tracker
- `ENHANCEMENT_PLAN.md` - Full feature specifications
- `prisma/schema.prisma` - Data model (276 lines)

## Common Tasks

**Adding a New Page:**
1. Create `app/[route]/page.tsx`
2. Add metadata export
3. Use Server Component by default
4. Fetch data with Prisma, serialize dates
5. Pass to Client Component if interactivity needed

**Adding New Resource Type:**
1. Update ResourceType enum in schema
2. Run `npm run db:generate && npm run db:push`
3. Update seed data if needed
4. Update ResourceCard display logic

**Creating Dashboard Feature:**
1. Check user role with `getCurrentUser()` and `isChapterAdmin()`/`isWTSAAdmin()`
2. Filter data by chapter ID for chapter admins
3. Use conditional rendering for role-specific actions
4. Return 403 for unauthorized access

**Testing Locally:**
```bash
npm run dev              # Start dev server on :3000
npm run type-check       # Check TypeScript errors
npm run lint             # Run ESLint
```

## Competition Context

This is a TSA competition project with specific requirements:
- Student Work Log page required (`/student-work-log`)
- Copyright Checklist page required (`/copyright-checklist`)
- "Unity Through Community" theme
- Focus on inter-chapter collaboration
- Accessibility (WCAG AA) important for judging
