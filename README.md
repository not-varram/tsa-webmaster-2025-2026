# WTSA Community Resource Hub

**Unity Through Community** - A comprehensive resource platform connecting Washington TSA chapters.

## Project Overview

The WTSA Community Resource Hub is a web application designed for the 2025-2026 TSA Webmaster competition. It fulfills the "Community Resource Hub" brief by providing an interactive directory of resources, highlighting key programs, enabling resource suggestions, and fostering collaboration among Washington TSA chapters.

### Our Interpretation

We interpreted "community" as the entire WTSA ecosystem—students, advisors, chapters, and the state organization. Our "residents" are the members who need access to resources, mentorship, and collaboration opportunities.

## Features

### Core Requirements (Competition Brief)

1. **Interactive Resource Directory** - Searchable, filterable database of resources
2. **Highlighted Resources** - Showcases 3+ important programs on the home page
3. **Resource Suggestion Form** - Public form for contributing new resources
4. **Additional Content** - Chapter profiles, Events, Mentor program

### Pages

- **Home** - Hero, highlights, directory preview, chapter connections
- **Resource Hub** - Full directory with search and filtering
- **Chapters** - Directory of WTSA chapters with profiles
- **Events** - Calendar of workshops, competitions, and training
- **About** - Explanation of our solution and theme
- **Suggest Resource** - Form to contribute resources
- **For Judges** - Technical documentation and compliance information
- **Student Work Log** - Detailed timeline of development tasks
- **Copyright Checklist** - Complete attribution of all assets

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### Backend
- **PostgreSQL** - Relational database
- **Prisma ORM** - Type-safe database client
- **Next.js API Routes** - Serverless API endpoints

### Deployment
- Production-ready build with static generation
- Optimized for Vercel or similar platforms

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd tsa-webmaster-2025-2026
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file with your database credentials:
```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

4. Set up the database
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npx prisma db push

# Seed demo data
npm run db:seed
```

5. Start development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
tsa-webmaster-2025-2026/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── resources/         # Resource hub pages
│   ├── chapters/          # Chapter directory pages
│   ├── events/            # Events page
│   ├── suggest/           # Suggestion form
│   ├── judges/            # For judges page
│   ├── student-work-log/  # Work log page
│   ├── copyright-checklist/  # Copyright page
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── cards/            # Card components
│   ├── layout/           # Layout components
│   └── forms/            # Form components
├── lib/                  # Utilities and database client
├── prisma/               # Database schema and seed
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Run production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check with TypeScript
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with demo data

## Database Schema

The application uses 6 main tables:

- **User** - User accounts (students, advisors, admins)
- **Chapter** - TSA chapters with locations and details
- **Resource** - Shared resources (guides, templates, tools)
- **Suggestion** - Pending resource suggestions
- **Event** - Workshops, competitions, training sessions
- **MentorPair** - Mentor/mentee chapter relationships

See `prisma/schema.prisma` for the complete schema.

## Competition Compliance

This project fully complies with the TSA Webmaster competition requirements:

✅ Interactive directory with search and filters  
✅ At least 3 highlighted resources  
✅ Public resource suggestion form  
✅ Substantial additional content (chapters, events, mentorship)  
✅ Student Work Log page  
✅ Copyright Checklist page  
✅ Responsive design (mobile, tablet, desktop)  
✅ Accessibility-focused (WCAG AA)  
✅ Cross-browser compatible

## Accessibility

- Semantic HTML5 elements throughout
- WCAG AA color contrast
- Keyboard navigation support
- Focus indicators on interactive elements
- ARIA labels where appropriate
- Responsive design (320px+)

## Credits

**Team Members:**
- Full Stack Development
- UI/UX Design
- Content Writing
- Database Design
- QA & Testing

**Technologies:**
- Next.js by Vercel
- React by Meta
- Tailwind CSS by Tailwind Labs
- Prisma by Prisma Data
- Lucide Icons
- Inter font by Google Fonts

**Competition:**
- Technology Student Association (TSA)
- Washington TSA
- 2025-2026 Webmaster Event

## License

This project was created for educational purposes as part of the TSA Webmaster competition.

---

**Built with ❤️ for Unity Through Community**
