# WTSA Coalesce - Community Resource Hub

**Unity Through Community** — A comprehensive resource platform connecting Washington TSA chapters.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748?logo=prisma)](https://www.prisma.io/)

## Overview

WTSA Coalesce is a web application built for the 2025-2026 TSA Webmaster competition. It fulfills the "Community Resource Hub" brief by providing an interactive directory of resources, community collaboration tools, and chapter networking capabilities for Washington TSA chapters.

### The Problem We Solve

Many TSA chapters across Washington operate with uneven access to resources and support. Some chapters lack funding or essential materials, while others have them in surplus without a way to share. This imbalance makes it difficult for new and existing chapters to provide the best experience for their members.

### Our Solution

Coalesce creates a centralized platform where:
- Chapters can discover and access resources from WTSA and fellow chapters
- Students and advisors can search and filter to find exactly what they need
- Members can request resources they need or offer materials to share
- New chapters can connect with established ones for mentorship

## Features

### Core Functionality
- **Interactive Resource Directory** — Searchable, filterable database with type, category, and audience filters
- **Community Board** — Post resource requests or offerings; connect with other chapters
- **Chapter Directory** — Browse all WTSA chapters organized by region
- **Events Calendar** — View upcoming workshops, competitions, and training sessions
- **Resource Suggestions** — Public form for contributing new resources

### Authentication & Authorization
- **Role-Based Access** — WTSA Admin, Chapter Admin, Student, and Public roles
- **Student Verification** — Chapter admins verify student accounts before full access
- **Secure Authentication** — JWT tokens with bcrypt password hashing

### Admin Features
- **WTSA Admin Dashboard** — Manage all chapters, view statistics
- **Chapter Admin Dashboard** — Verify students, approve resource posts, manage chapter

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.6 |
| **Styling** | Tailwind CSS 3.4 |
| **Database** | PostgreSQL |
| **ORM** | Prisma 5.20 |
| **Authentication** | JWT (jose) + bcryptjs |
| **Validation** | Zod + React Hook Form |
| **Icons** | Lucide React |

## Quick Start

### Prerequisites
- Node.js 18+ (or pnpm)
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tsa-webmaster-2025-2026

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Generate Prisma client
pnpm db:generate

# Push schema to database
npx prisma db push

# Seed demo data (optional)
pnpm db:seed

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| WTSA Admin | admin@wtsa.org | password123 |
| Chapter Admin | admin@lwhs.edu | password123 |
| Student | student@lwhs.edu | password123 |

## Project Structure

```
tsa-webmaster-2025-2026/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication pages (sign-in, sign-up)
│   ├── api/                 # API routes
│   │   ├── admin/           # Admin-only endpoints
│   │   ├── auth/            # Authentication endpoints
│   │   ├── posts/           # Community board posts
│   │   └── suggestions/     # Resource suggestions
│   ├── chapters/            # Chapter directory
│   ├── dashboard/           # Admin dashboards
│   ├── events/              # Events calendar
│   ├── profile/             # User profile
│   ├── resources/           # Resource hub
│   └── suggest/             # Suggestion form
├── components/              # React components
│   ├── cards/               # Card components
│   ├── dashboard/           # Dashboard components
│   ├── forms/               # Form components
│   ├── home/                # Home page components
│   ├── layout/              # Layout components (Header, Footer)
│   ├── posts/               # Community board components
│   ├── resources/           # Resource components
│   └── ui/                  # Base UI components
├── lib/                     # Utilities
│   ├── auth.ts              # Authentication helpers
│   ├── db.ts                # Prisma client
│   └── utils.ts             # General utilities
├── prisma/                  # Database
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script
├── public/                  # Static assets
└── docs/                    # Documentation
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Type check with TypeScript |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:seed` | Seed database with demo data |

## Documentation

Detailed documentation is available in the `/docs` directory:

- [Architecture Overview](docs/ARCHITECTURE.md) — System design and technical decisions
- [API Documentation](docs/API.md) — REST API endpoints
- [Development Guide](docs/DEVELOPMENT.md) — Setup and development workflow
- [Deployment Guide](docs/DEPLOYMENT.md) — Production deployment instructions
- [Database Schema](docs/DATABASE.md) — Database models and relationships

## Competition Compliance

This project fully complies with the TSA Webmaster competition requirements:

- ✅ Interactive directory with search and filters
- ✅ At least 3 highlighted resources on home page
- ✅ Public resource suggestion form
- ✅ Substantial additional content (chapters, events, community board)
- ✅ Student Work Log page
- ✅ Copyright Checklist page
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessibility-focused (WCAG AA)
- ✅ Cross-browser compatible

## Accessibility

- Semantic HTML5 elements throughout
- WCAG AA color contrast ratios
- Full keyboard navigation support
- Focus indicators on interactive elements
- ARIA labels where appropriate
- Responsive design from 320px+

## Credits

**Technologies:**
- [Next.js](https://nextjs.org/) by Vercel
- [React](https://react.dev/) by Meta
- [Tailwind CSS](https://tailwindcss.com/) by Tailwind Labs
- [Prisma](https://prisma.io/) by Prisma Data
- [Lucide Icons](https://lucide.dev/)
- [DM Sans](https://fonts.google.com/specimen/DM+Sans) by Google Fonts

**Competition:**
- Technology Student Association (TSA)
- Washington TSA
- 2025-2026 Webmaster Event

## License

This project was created for educational purposes as part of the TSA Webmaster competition.

---

**Built with ❤️ for Unity Through Community**
