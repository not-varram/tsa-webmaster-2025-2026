# Architecture Overview

This document describes the technical architecture of WTSA Coalesce, including system design decisions, component structure, and data flow.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                           │
├─────────────────────────────────────────────────────────────────┤
│                    Next.js App (Frontend + API)                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Pages (Server Components)    │   Client Components      │    │
│  │  - Home, Resources, Chapters  │   - Header, Forms        │    │
│  │  - Events, Dashboard          │   - CommunityPostsClient │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    API Routes (/api)                      │    │
│  │  - /auth (sign-in, sign-up, sign-out, me)                │    │
│  │  - /posts (CRUD for community board)                      │    │
│  │  - /admin/students (verification, password reset)         │    │
│  │  - /suggestions (resource suggestions)                    │    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│                         Prisma ORM                               │
├─────────────────────────────────────────────────────────────────┤
│                    PostgreSQL Database                           │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Choices

### Next.js 14 with App Router

We chose Next.js 14 for several reasons:

1. **Server Components** — Reduce client-side JavaScript, improve performance
2. **App Router** — Modern routing with layouts, loading states, and error boundaries
3. **API Routes** — Backend API in the same codebase
4. **Static Generation** — Pre-render pages where possible
5. **Incremental Static Regeneration** — Update static pages without full rebuild

### TypeScript

Full type safety across the codebase:
- Type-safe database queries with Prisma
- Type-safe API responses
- Component props validation
- IDE autocomplete and error detection

### Tailwind CSS

Utility-first CSS framework:
- Rapid UI development
- Consistent design system via `tailwind.config.ts`
- Custom color palette for WTSA branding
- Responsive design utilities

### PostgreSQL + Prisma

- **PostgreSQL** — Robust relational database with JSON support
- **Prisma** — Type-safe ORM with migrations and introspection
- **Indexed queries** — Database indexes on frequently queried fields

## Application Layers

### 1. Presentation Layer

**Server Components** (default in App Router):
- Fetch data directly in components
- No client-side JavaScript
- SEO-friendly rendering

**Client Components** (marked with `'use client'`):
- Interactive UI elements
- Form handling
- Real-time state updates

### 2. API Layer

RESTful API routes in `/app/api/`:

```
/api/auth/
├── sign-in/route.ts      # POST - User authentication
├── sign-up/route.ts      # POST - User registration
├── sign-out/route.ts     # POST - Clear session
├── me/route.ts           # GET - Current user info
├── change-password/      # POST - Update password
└── update-profile/       # PATCH - Update user profile

/api/posts/
├── route.ts              # GET/POST - List/create posts
└── [id]/
    ├── route.ts          # GET/PATCH - Single post
    └── comments/route.ts # GET/POST - Post comments

/api/admin/students/
├── route.ts              # GET - List students
└── [id]/
    ├── verify/route.ts   # POST - Verify student
    └── reset-password/   # POST - Reset password

/api/suggestions/route.ts # POST - Submit suggestion
/api/chapters/route.ts    # GET - List chapters
```

### 3. Data Access Layer

**Prisma Client** (`lib/db.ts`):
- Singleton pattern to prevent connection exhaustion
- Type-safe queries generated from schema
- Transaction support

**Auth Utilities** (`lib/auth.ts`):
- JWT token creation/verification
- Password hashing with bcrypt
- Session management
- Role-based access helpers

### 4. Database Layer

PostgreSQL with the following models:
- User (with roles and verification)
- Chapter (with admin emails)
- Resource (physical and digital)
- ResourcePost (community board)
- PostComment
- Event
- Suggestion
- Session (optional DB-backed sessions)
- ForumThread/ForumReply (future feature)

## Authentication Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Sign Up    │───>│   Create     │───>│   PENDING    │
│   Form       │    │   User       │    │   Status     │
└──────────────┘    └──────────────┘    └──────┬───────┘
                                               │
                    ┌──────────────────────────┘
                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Chapter    │───>│   Verify     │───>│   APPROVED   │
│   Admin      │    │   Student    │    │   Status     │
└──────────────┘    └──────────────┘    └──────┬───────┘
                                               │
                    ┌──────────────────────────┘
                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Sign In    │───>│   JWT Token  │───>│   Full       │
│   Form       │    │   Created    │    │   Access     │
└──────────────┘    └──────────────┘    └──────────────┘
```

### JWT Token Structure

```typescript
{
  id: string,           // User ID
  email: string,        // User email
  name: string,         // Display name
  role: UserRole,       // ADMIN | CHAPTER_ADMIN | STUDENT | PUBLIC
  chapterId: string,    // Associated chapter (nullable)
  verificationStatus: VerificationStatus, // PENDING | APPROVED | REJECTED
  tokenVersion: number  // Incremented to invalidate all sessions
}
```

### Token Versioning

When a user changes their password:
1. `tokenVersion` is incremented in the database
2. Existing tokens become invalid (version mismatch)
3. User must sign in again with new credentials

## Middleware

The middleware (`middleware.ts`) handles:

1. **Route Protection** — Check authentication for protected routes
2. **Verification Check** — Ensure verified status for certain actions
3. **Token Validation** — Verify JWT signature and expiration

Protected routes:
- `/dashboard/*` — Requires authentication
- `/profile` — Requires authentication
- `/api/admin/*` — Requires admin role
- `/api/posts` (POST) — Requires verified user

## Component Architecture

### Layout Components

```
RootLayout (app/layout.tsx)
├── AnimatedBackground
├── Header (client component)
│   ├── Navigation
│   ├── User Menu (auth state)
│   └── Mobile Menu
├── Main Content (children)
└── Footer
```

### Page Components

Most pages follow this pattern:
1. **Server Component** — Fetches data from database
2. **Client Component** — Handles interactivity

Example: Resources Page
```tsx
// app/resources/page.tsx (Server)
export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany()
  return <ResourcesClient initialResources={resources} />
}

// components/resources/ResourcesClient.tsx (Client)
'use client'
export function ResourcesClient({ initialResources }) {
  const [searchQuery, setSearchQuery] = useState('')
  // Client-side filtering
}
```

### Shared Components

Located in `/components/`:
- **ui/** — Base components (Button, Card)
- **cards/** — Display cards (ResourceCard, ChapterCard, EventCard)
- **forms/** — Form components (SearchBar)
- **layout/** — Structural components (Header, Footer)
- **posts/** — Community board components

## Data Flow

### Server-Side Data Fetching

```tsx
// Direct database access in Server Components
export default async function ChaptersPage() {
  const chapters = await prisma.chapter.findMany({
    orderBy: { name: 'asc' }
  })
  
  return <ChapterList chapters={chapters} />
}
```

### Client-Side Data Fetching

```tsx
// API calls in Client Components
'use client'
export function CommunityPostsClient() {
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data.posts))
  }, [])
}
```

### Form Submissions

```tsx
// API route handles POST
const handleSubmit = async (data) => {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  // Handle response
}
```

## Caching Strategy

### Static Generation

Pages with infrequent updates use ISR:
```tsx
export const revalidate = 3600 // Revalidate every hour
```

### Dynamic Routes

User-specific pages disable caching:
```tsx
export const revalidate = 0 // Always fresh
```

### Client-Side Caching

React state for optimistic updates and local filtering.

## Security Considerations

1. **Password Hashing** — bcrypt with 12 salt rounds
2. **JWT Security** — HS256 algorithm, httpOnly cookies
3. **CSRF Protection** — SameSite cookie attribute
4. **Input Validation** — Zod schemas for all inputs
5. **SQL Injection** — Prisma parameterized queries
6. **XSS Prevention** — React automatic escaping

## Performance Optimizations

1. **Database Indexes** — On frequently queried columns
2. **Image Optimization** — Next.js Image component
3. **Code Splitting** — Automatic route-based splitting
4. **Static Assets** — Public folder with caching
5. **Minimal Client JS** — Server Components by default

## Future Considerations

- **Forum Feature** — ForumThread/ForumReply models are ready
- **Resource Requests** — ResourceRequest model for borrowing
- **Real-time Updates** — WebSocket support for live notifications
- **Email Notifications** — Verification and password reset emails
