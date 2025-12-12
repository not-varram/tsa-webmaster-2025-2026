# WTSA Hub Enhancement Plan - Authentication & Physical Resources

## Overview

Adding authentication, physical resource management, and student discussion forum to the existing WTSA Community Resource Hub.

## New Features

### 1. Authentication System

**Technology:** NextAuth.js v5 with Google OAuth

**User Roles:**
- **Student** - Regular students, can participate in forum
- **Chapter Admin** - Manage their chapter's resources and requests
- **WTSA Admin** - Manage all chapters and distribute organizational resources
- **Public** - Unauthenticated users (current read-only access)

**Sign-in Pages:**
- `/auth/signin` - Universal sign-in (detects role)
- `/auth/chapter-admin` - Chapter admin login
- `/auth/wtsa-admin` - WTSA admin login (separate for security)

### 2. Physical Resources

**Resource Types:**
- **Digital** - Existing (templates, videos, guides, etc.)
- **Physical** - New type for tangible items:
  - Competition equipment (robots, materials)
  - Books and reference materials
  - Tools and hardware
  - Event supplies

**Physical Resource Fields:**
- Quantity available
- Location (which chapter has it)
- Request/borrow system
- Return date tracking
- Condition notes

### 3. Chapter Scope Limitation

**Active Chapters (3 total):**
1. Lake Washington High School Chapter
2. Redmond High School Chapter  
3. Juanita High School Chapter

**Update:**
- Seed data to include only these 3 chapters
- Keep other chapters in schema for scalability
- Focus UI on these active chapters

### 4. Chapter Admin Dashboard

**Path:** `/dashboard/chapter`

**Features:**
- View chapter inventory (physical + digital resources)
- Advertise new physical resources
- Request resources from other chapters
- View incoming requests
- Approve/deny resource loans
- Track borrowed items and return dates
- Chapter statistics

### 5. WTSA Admin Dashboard

**Path:** `/dashboard/wtsa`

**Features:**
- View all chapters and their inventories
- Distribute WTSA-official resources
- Approve resource requests between chapters
- Manage chapter permissions
- System-wide analytics
- Approve suggested resources (existing feature enhanced)

### 6. Student Forum

**Path:** `/forum`

**Features:**
- Discussion categories:
  - General
  - Competition Tips
  - Project Help
  - Chapter Meetups
  - Resources & Tools
- Thread creation (authenticated students only)
- Replies and nested comments
- Search threads
- Upvote/downvote (optional)
- Moderator actions for admins

## Database Schema Changes

### New Tables

```prisma
model Account {
  // NextAuth account linking
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}

model Session {
  // NextAuth sessions
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model ForumThread {
  id          String   @id @default(cuid())
  title       String
  category    String
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  content     String   @db.Text
  isPinned    Boolean  @default(false)
  isLocked    Boolean  @default(false)
  replies     ForumReply[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ForumReply {
  id        String   @id @default(cuid())
  threadId  String
  thread    ForumThread @relation(fields: [threadId], references: [id])
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ResourceRequest {
  id                String   @id @default(cuid())
  resourceId        String
  resource          Resource @relation(fields: [resourceId], references: [id])
  requestingChapterId String
  requestingChapter Chapter  @relation("RequestingChapter", fields: [requestingChapterId], references: [id])
  owningChapterId   String
  owningChapter     Chapter  @relation("OwningChapter", fields: [owningChapterId], references: [id])
  status            RequestStatus @default(PENDING)
  requestedBy       String
  requester         User     @relation(fields: [requestedBy], references: [id])
  borrowDate        DateTime?
  returnDate        DateTime?
  notes             String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

enum RequestStatus {
  PENDING
  APPROVED
  REJECTED
  BORROWED
  RETURNED
}
```

### Updated Models

```prisma
model User {
  // Add new fields
  image          String?
  emailVerified  DateTime?
  accounts       Account[]
  sessions       Session[]
  forumThreads   ForumThread[]
  forumReplies   ForumReply[]
  resourceRequests ResourceRequest[]
}

model Resource {
  // Add new fields
  isPhysical     Boolean  @default(false)
  quantity       Int?
  location       String?
  condition      String?
  availableDate  DateTime?
  requests       ResourceRequest[]
}

model Chapter {
  // Add new fields
  adminEmails    String[]  // Google emails of chapter admins
  requestsMade   ResourceRequest[] @relation("RequestingChapter")
  requestsReceived ResourceRequest[] @relation("OwningChapter")
}
```

## Implementation Steps

### Step 1: Install Dependencies
```bash
npm install next-auth@beta @auth/prisma-adapter
```

### Step 2: Configure NextAuth
- Create `auth.ts` with Google provider
- Set up callbacks for role detection
- Configure session strategy

### Step 3: Update Database
- Add new tables to Prisma schema
- Run migrations
- Update seed data

### Step 4: Build Auth UI
- Sign-in pages for each role
- Protected route middleware
- Role-based navigation

### Step 5: Chapter Admin Features
- Dashboard layout
- Resource management forms
- Request system

### Step 6: WTSA Admin Features
- Administrative dashboard
- Approval workflows
- Analytics views

### Step 7: Forum Implementation
- Thread listing
- Thread creation form
- Reply system
- Search/filter

### Step 8: Testing
- Auth flow testing
- Permission testing
- Forum functionality

## Environment Variables Needed

```env
# Existing
DATABASE_URL=...

# New
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
```

## Security Considerations

1. **Role Verification:** Verify user roles on every protected API route
2. **Email Whitelist:** Chapter admin emails stored in database, checked on login
3. **WTSA Admin:** Single hardcoded admin email or separate admin table
4. **Resource Requests:** Only chapter admins can make requests for their chapter
5. **Forum Moderation:** Admins can delete/lock threads

## UI/UX Updates

1. **Navigation:** Add "Dashboard" and "Forum" links when authenticated
2. **User Menu:** Profile dropdown with sign-out
3. **Protected Pages:** Redirect to sign-in if unauthorized
4. **Resource Cards:** Show "Physical" badge and availability
5. **Request Button:** "Request This Resource" for physical items

## Questions to Confirm

1. Should students be able to see who has which physical resources?
2. Can any chapter request from any other chapter, or only between the 3?
3. Should WTSA admin approve ALL resource requests or just between-chapter transfers?
4. Forum moderation: auto-approve posts or require admin approval?
5. Google OAuth: Do you have Google Cloud project set up, or should I provide setup instructions?
