# API Documentation

This document describes all REST API endpoints available in WTSA Coalesce.

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## Authentication

Most endpoints require authentication via JWT token stored in an httpOnly cookie named `auth_token`.

### Authentication Headers

The token is automatically sent via cookies. No manual header required.

### Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not authenticated) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Authentication Endpoints

### POST /api/auth/sign-up

Create a new user account.

**Request Body:**
```json
{
  "email": "student@school.edu",
  "password": "securepassword123",
  "name": "John Doe",
  "chapterId": "clxxxxxx"
}
```

**Validation:**
- `email` — Valid email address (required)
- `password` — Minimum 8 characters (required)
- `name` — Minimum 2 characters (required)
- `chapterId` — Valid chapter ID (required)

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "clxxxxxx",
    "email": "student@school.edu",
    "name": "John Doe",
    "role": "STUDENT",
    "verificationStatus": "PENDING"
  },
  "message": "Account created. Pending verification by your chapter admin."
}
```

**Notes:**
- If email matches a chapter's `adminEmails`, user is auto-assigned `CHAPTER_ADMIN` role
- Chapter admins are auto-verified; students require manual verification

---

### POST /api/auth/sign-in

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "student@school.edu",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "clxxxxxx",
    "email": "student@school.edu",
    "name": "John Doe",
    "role": "STUDENT",
    "chapterId": "clxxxxxx",
    "chapterName": "Lake Washington High School TSA",
    "verificationStatus": "APPROVED"
  }
}
```

**Error (403):**
```json
{
  "error": "Your account is not approved yet. Please wait for your chapter admin to approve you."
}
```

**Notes:**
- Sets `auth_token` httpOnly cookie
- Blocked if `verificationStatus` is not `APPROVED`

---

### POST /api/auth/sign-out

End the current session.

**Response (200):**
```json
{
  "success": true
}
```

**Notes:**
- Clears the `auth_token` cookie

---

### GET /api/auth/me

Get the current authenticated user.

**Response (200):**
```json
{
  "user": {
    "id": "clxxxxxx",
    "email": "student@school.edu",
    "name": "John Doe",
    "role": "STUDENT",
    "chapterId": "clxxxxxx",
    "chapterName": "Lake Washington High School TSA",
    "verificationStatus": "APPROVED"
  }
}
```

**Response (401):**
```json
{
  "user": null
}
```

---

### POST /api/auth/change-password

Change the current user's password. **Requires authentication.**

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newsecurepassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Notes:**
- Invalidates all existing sessions (increments `tokenVersion`)
- Issues new token with updated version

---

### PATCH /api/auth/update-profile

Update the current user's profile. **Requires authentication.**

**Request Body:**
```json
{
  "name": "Jane Doe"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "clxxxxxx",
    "email": "student@school.edu",
    "name": "Jane Doe",
    "role": "STUDENT",
    "chapterId": "clxxxxxx",
    "chapterName": "Lake Washington High School TSA",
    "verificationStatus": "APPROVED"
  }
}
```

---

## Posts Endpoints (Community Board)

### GET /api/posts

List resource posts.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `REQUEST` \| `OFFERING` | Filter by post type |
| `category` | string | Filter by category |
| `status` | `APPROVED` \| `FILLED` | Filter by status (default: APPROVED) |
| `my` | boolean | Show only current user's posts |
| `pending` | boolean | Show pending posts (admin only) |

**Response (200):**
```json
{
  "posts": [
    {
      "id": "clxxxxxx",
      "title": "Looking for Arduino kits",
      "description": "Our chapter needs 5 Arduino starter kits for robotics...",
      "type": "REQUEST",
      "category": "Technical Materials",
      "tags": ["arduino", "robotics", "electronics"],
      "status": "APPROVED",
      "author": {
        "id": "clxxxxxx",
        "name": "John Doe",
        "email": "john@school.edu"
      },
      "chapter": {
        "id": "clxxxxxx",
        "name": "Lake Washington High School TSA",
        "slug": "lake-washington-hs"
      },
      "filledBy": null,
      "_count": {
        "comments": 3
      },
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### POST /api/posts

Create a new resource post. **Requires authentication + verification.**

**Request Body:**
```json
{
  "title": "Looking for Arduino kits",
  "description": "Our chapter needs 5 Arduino starter kits for our robotics program...",
  "type": "REQUEST",
  "category": "Technical Materials",
  "tags": ["arduino", "robotics"]
}
```

**Validation:**
- `title` — Minimum 5 characters (required)
- `description` — Minimum 20 characters (required)
- `type` — `REQUEST` or `OFFERING` (required)
- `category` — Valid category (required)
- `tags` — Array of strings (optional)

**Valid Categories:**
- Technical Materials
- Building Materials
- Equipment
- Competition Resources
- Software/Digital
- Other

**Response (200):**
```json
{
  "post": { ... },
  "message": "Post created successfully. It will be visible once approved by an admin."
}
```

**Notes:**
- Posts from admins/chapter admins are auto-approved
- Student posts require admin approval

---

### GET /api/posts/[id]

Get a single post with comments.

**Response (200):**
```json
{
  "post": {
    "id": "clxxxxxx",
    "title": "Looking for Arduino kits",
    "description": "...",
    "type": "REQUEST",
    "category": "Technical Materials",
    "tags": ["arduino", "robotics"],
    "status": "APPROVED",
    "author": { ... },
    "chapter": { ... },
    "comments": [
      {
        "id": "clxxxxxx",
        "content": "We have 3 kits available!",
        "author": { ... },
        "isFulfillment": false,
        "createdAt": "2025-01-02T00:00:00.000Z"
      }
    ],
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /api/posts/[id]

Update post status. **Requires authentication + admin role.**

**Request Body (approve/reject):**
```json
{
  "action": "approve"
}
```

**Request Body (mark as filled):**
```json
{
  "action": "fill"
}
```

**Response (200):**
```json
{
  "post": { ... },
  "message": "Post approved successfully"
}
```

---

### POST /api/posts/[id]/comments

Add a comment to a post. **Requires authentication + verification.**

**Request Body:**
```json
{
  "content": "We have 3 kits available! Contact us at...",
  "isFulfillment": false
}
```

**Response (200):**
```json
{
  "comment": {
    "id": "clxxxxxx",
    "content": "We have 3 kits available!",
    "author": { ... },
    "isFulfillment": false,
    "createdAt": "2025-01-02T00:00:00.000Z"
  }
}
```

---

## Admin Endpoints

### GET /api/admin/students

List students. **Requires authentication + admin role.**

**Response (200):**
```json
{
  "students": [
    {
      "id": "clxxxxxx",
      "name": "John Doe",
      "email": "john@school.edu",
      "verificationStatus": "PENDING",
      "chapter": {
        "id": "clxxxxxx",
        "name": "Lake Washington High School TSA"
      },
      "verifiedBy": null,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Notes:**
- WTSA admins see all students
- Chapter admins see only their chapter's students

---

### POST /api/admin/students/[id]/verify

Verify or reject a student. **Requires authentication + admin role.**

**Request Body:**
```json
{
  "approved": true
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "clxxxxxx",
    "name": "John Doe",
    "verificationStatus": "APPROVED"
  }
}
```

---

### POST /api/admin/students/[id]/reset-password

Reset a student's password. **Requires authentication + chapter admin role.**

**Response (200):**
```json
{
  "success": true,
  "tempPassword": "Abc123XyZ789"
}
```

**Notes:**
- Returns a temporary password to share with the student
- Only chapter admins can reset passwords (not WTSA admin)

---

## Suggestions Endpoint

### POST /api/suggestions

Submit a resource suggestion. **Public endpoint.**

**Request Body:**
```json
{
  "resourceName": "CAD Tutorial Series",
  "description": "A great series of tutorials for learning CAD...",
  "url": "https://example.com/cad-tutorials",
  "audience": "Students",
  "category": "Competition Prep",
  "chapterName": "Lake Washington HS",
  "email": "submitter@email.com"
}
```

**Validation:**
- `resourceName` — Required
- `description` — Required
- `audience` — Required
- `category` — Required
- `url` — Optional
- `chapterName` — Optional
- `email` — Optional

**Response (201):**
```json
{
  "success": true,
  "suggestion": {
    "id": "clxxxxxx",
    "resourceName": "CAD Tutorial Series",
    "status": "PENDING",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## Chapters Endpoint

### GET /api/chapters

List all chapters. **Public endpoint.**

**Response (200):**
```json
{
  "chapters": [
    {
      "id": "clxxxxxx",
      "slug": "lake-washington-hs",
      "name": "Lake Washington High School TSA",
      "schoolName": "Lake Washington High School",
      "city": "Kirkland",
      "region": "King County"
    }
  ]
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production:
- Auth endpoints: 5 requests/minute
- Post creation: 10 requests/minute
- General API: 100 requests/minute
