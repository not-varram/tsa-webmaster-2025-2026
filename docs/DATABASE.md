# Database Schema Documentation

This document describes the database schema for WTSA Coalesce, including all models, relationships, and field descriptions.

## Overview

The database uses PostgreSQL with Prisma ORM. The schema is defined in `prisma/schema.prisma`.

## Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Chapter   │────<│     User     │>────│   Session    │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│   Resource   │     │ ResourcePost │
└──────────────┘     └──────────────┘
       │                    │
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│ResourceReqst │     │ PostComment  │
└──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐
│    Event     │     │  Suggestion  │
└──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐
│ ForumThread  │────<│  ForumReply  │
└──────────────┘     └──────────────┘
```

---

## Enums

### UserRole

```prisma
enum UserRole {
  PUBLIC         // Anonymous/public user
  STUDENT        // Verified student
  CHAPTER_ADMIN  // Chapter administrator
  ADMIN          // WTSA administrator
}
```

### VerificationStatus

```prisma
enum VerificationStatus {
  PENDING   // Awaiting verification
  APPROVED  // Verified and active
  REJECTED  // Rejected by admin
}
```

### ResourceType

```prisma
enum ResourceType {
  TEMPLATE   // Document templates
  VIDEO      // Video content
  WORKSHOP   // Workshop materials
  GUIDE      // Guides and tutorials
  TOOL       // Tools and utilities
  EVENT      // Event-related resources
  SERVICE    // Services offered
}
```

### ResourceOrigin

```prisma
enum ResourceOrigin {
  WTSA              // Official WTSA resource
  CHAPTER           // Chapter-created resource
  EXTERNAL_PARTNER  // External partner resource
}
```

### PostType

```prisma
enum PostType {
  REQUEST   // Looking for a resource
  OFFERING  // Offering a resource to share
}
```

### PostStatus

```prisma
enum PostStatus {
  PENDING   // Awaiting admin approval
  APPROVED  // Visible on community board
  REJECTED  // Rejected by admin
  FILLED    // Request fulfilled or offering claimed
  CLOSED    // Closed by author
}
```

### SuggestionStatus

```prisma
enum SuggestionStatus {
  PENDING   // Awaiting review
  APPROVED  // Approved and added to resources
  REJECTED  // Rejected
}
```

### RequestStatus

```prisma
enum RequestStatus {
  PENDING    // Request submitted
  APPROVED   // Request approved
  REJECTED   // Request rejected
  BORROWED   // Resource borrowed
  RETURNED   // Resource returned
  CANCELLED  // Request cancelled
}
```

---

## Models

### User

Represents a user account in the system.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Primary key (CUID) |
| `email` | String | Unique email address |
| `password` | String | Bcrypt-hashed password |
| `name` | String | Display name |
| `role` | UserRole | User's role (default: STUDENT) |
| `chapterId` | String? | Associated chapter ID |
| `tokenVersion` | Int | Incremented to invalidate sessions |
| `verificationStatus` | VerificationStatus | Account verification status |
| `verifiedById` | String? | ID of admin who verified |
| `verifiedAt` | DateTime? | When verified |
| `createdAt` | DateTime | Account creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Relations:**
- `chapter` — Belongs to a Chapter
- `verifiedBy` — Verified by another User
- `verifiedStudents` — Students verified by this user
- `forumThreads` — Forum threads created
- `forumReplies` — Forum replies created
- `resourceRequests` — Resource requests made
- `resourcePosts` — Community board posts created
- `reviewedPosts` — Posts reviewed (as admin)
- `postComments` — Comments on posts
- `filledPosts` — Posts fulfilled by this user

**Indexes:**
- `email` (unique)
- `chapterId`
- `verificationStatus`

---

### Chapter

Represents a TSA chapter.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Primary key (CUID) |
| `slug` | String | URL-friendly identifier |
| `name` | String | Chapter name |
| `schoolName` | String | School name |
| `city` | String | City location |
| `region` | String | Geographic region |
| `about` | String | Description (Text) |
| `latitude` | Float? | GPS latitude |
| `longitude` | Float? | GPS longitude |
| `adminEmails` | String[] | Emails of chapter admins |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Relations:**
- `users` — Users belonging to this chapter
- `resources` — Resources from this chapter
- `requestsMade` — Resource requests by this chapter
- `requestsReceived` — Resource requests to this chapter
- `resourcePosts` — Community board posts from this chapter

**Indexes:**
- `slug` (unique)
- `region`

---

### Resource

Represents a shared resource in the directory.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Primary key (CUID) |
| `slug` | String | URL-friendly identifier |
| `title` | String | Resource title |
| `summary` | String | Short description |
| `description` | String | Full description (Text) |
| `type` | ResourceType | Type of resource |
| `audience` | String[] | Target audiences |
| `category` | String | Resource category |
| `tags` | String[] | Searchable tags |
| `origin` | ResourceOrigin | Source of resource |
| `chapterId` | String? | Contributing chapter ID |
| `highlighted` | Boolean | Featured on home page |
| `url` | String? | External URL |
| `isPhysical` | Boolean | Physical vs digital resource |
| `quantity` | Int? | Available quantity |
| `condition` | String? | Physical condition |
| `location` | String? | Physical location |
| `availableDate` | DateTime? | When available |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Relations:**
- `chapter` — Contributing chapter
- `requests` — Borrow requests for this resource

**Indexes:**
- `slug` (unique)
- `type`
- `highlighted`
- `chapterId`
- `isPhysical`

---

### ResourcePost

Community board posts for requesting or offering resources.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Primary key (CUID) |
| `title` | String | Post title |
| `description` | String | Post description (Text) |
| `type` | PostType | REQUEST or OFFERING |
| `category` | String | Resource category |
| `tags` | String[] | Searchable tags |
| `authorId` | String | Post author ID |
| `chapterId` | String? | Author's chapter ID |
| `contactName` | String? | Contact name |
| `contactEmail` | String? | Contact email |
| `contactPhone` | String? | Contact phone |
| `contactNotes` | String? | Contact notes (Text) |
| `status` | PostStatus | Post status |
| `reviewedById` | String? | Reviewer ID |
| `reviewedAt` | DateTime? | Review timestamp |
| `rejectionReason` | String? | Reason for rejection (Text) |
| `filledById` | String? | User who fulfilled |
| `filledAt` | DateTime? | Fulfillment timestamp |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Relations:**
- `author` — Post author (User)
- `chapter` — Author's chapter
- `reviewedBy` — Admin who reviewed
- `filledBy` — User who fulfilled
- `comments` — Post comments

**Indexes:**
- `authorId`
- `chapterId`
- `status`
- `type`
- `category`
- `createdAt`

---

### PostComment

Comments on community board posts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Primary key (CUID) |
| `postId` | String | Parent post ID |
| `authorId` | String | Comment author ID |
| `content` | String | Comment content (Text) |
| `isFulfillment` | Boolean | Marks fulfillment comment |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Relations:**
- `post` — Parent ResourcePost
- `author` — Comment author (User)

**Indexes:**
- `postId`
- `authorId`
- `createdAt`

---

### Event

TSA events, workshops, and competitions.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Primary key (CUID) |
| `slug` | String | URL-friendly identifier |
| `title` | String | Event title |
| `description` | String | Event description (Text) |
| `startDatetime` | DateTime | Start date/time |
| `endDatetime` | DateTime | End date/time |
| `type` | String | Event type (Competition, Workshop, etc.) |
| `audience` | String[] | Target audiences |
| `location` | String | Event location |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Indexes:**
- `slug` (unique)
- `startDatetime`

---

### Suggestion

Resource suggestions from the public form.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Primary key (CUID) |
| `resourceName` | String | Suggested resource name |
| `description` | String | Resource description (Text) |
| `url` | String? | Resource URL |
| `audience` | String | Target audience |
| `category` | String | Resource category |
| `chapterName` | String? | Submitter's chapter |
| `email` | String? | Submitter's email |
| `status` | SuggestionStatus | Review status |
| `createdAt` | DateTime | Submission timestamp |

**Indexes:**
- `status`

---

### Session

Database-backed sessions (optional, currently using JWT).

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Primary key (CUID) |
| `userId` | String | Associated user ID |
| `token` | String | Session token |
| `expiresAt` | DateTime | Expiration timestamp |
| `createdAt` | DateTime | Creation timestamp |

**Indexes:**
- `token` (unique)
- `userId`

---

### ResourceRequest

Requests to borrow physical resources (future feature).

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Primary key (CUID) |
| `resourceId` | String | Requested resource ID |
| `requestingChapterId` | String? | Requesting chapter ID |
| `owningChapterId` | String? | Owning chapter ID |
| `requestedById` | String | User who made request |
| `status` | RequestStatus | Request status |
| `borrowDate` | DateTime? | Planned borrow date |
| `returnDate` | DateTime? | Planned return date |
| `actualReturnDate` | DateTime? | Actual return date |
| `notes` | String? | Request notes (Text) |
| `adminNotes` | String? | Admin notes (Text) |
| `createdAt` | DateTime | Request timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Relations:**
- `resource` — Requested resource
- `requestingChapter` — Chapter making request
- `owningChapter` — Chapter that owns resource
- `requestedBy` — User making request

**Indexes:**
- `resourceId`
- `requestingChapterId`
- `owningChapterId`
- `status`

---

### ForumThread

Forum discussion threads (future feature).

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Primary key (CUID) |
| `title` | String | Thread title |
| `category` | String | Thread category |
| `authorId` | String | Thread author ID |
| `content` | String | Thread content (Text) |
| `isPinned` | Boolean | Pinned to top |
| `isLocked` | Boolean | Comments disabled |
| `viewCount` | Int | View counter |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Relations:**
- `author` — Thread author (User)
- `replies` — Thread replies

**Indexes:**
- `authorId`
- `category`
- `createdAt`

---

### ForumReply

Replies to forum threads (future feature).

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Primary key (CUID) |
| `threadId` | String | Parent thread ID |
| `authorId` | String | Reply author ID |
| `content` | String | Reply content (Text) |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Relations:**
- `thread` — Parent ForumThread
- `author` — Reply author (User)

**Indexes:**
- `threadId`
- `authorId`

---

## Database Commands

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database (development)
npx prisma db push

# Create migration (production)
npx prisma migrate dev --name description

# Reset database
npx prisma db push --force-reset

# Seed database
pnpm db:seed

# Open Prisma Studio
npx prisma studio

# Format schema
npx prisma format
```

---

## Seed Data

The seed script (`prisma/seed.ts`) creates:

- **7 Chapters** — All WTSA chapters with locations
- **4 Users** — Admin, chapter admins, and students
- **4 Resources** — Sample resources (guides, workshops)
- **3 Events** — Sample events (competitions, meetups)

Run with:
```bash
pnpm db:seed
```
