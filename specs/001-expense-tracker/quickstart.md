# Quickstart: Expense Tracker

**Branch**: `001-expense-tracker` | **Date**: 2026-04-16

## Prerequisites

- Node.js 18.17+ (LTS recommended)
- pnpm (package manager — already used in project)

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Initialize the database
pnpm prisma generate
pnpm prisma db push

# 3. Seed default categories
pnpm prisma db seed

# 4. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Commands

| Command                   | Description                          |
|---------------------------|--------------------------------------|
| `pnpm dev`                | Start development server             |
| `pnpm build`              | Build for production                 |
| `pnpm start`              | Start production server              |
| `pnpm lint`               | Run ESLint                           |
| `pnpm prisma studio`      | Open Prisma database GUI             |
| `pnpm prisma db push`     | Push schema changes to database      |
| `pnpm prisma generate`    | Regenerate Prisma client             |
| `pnpm prisma db seed`     | Seed default categories              |

## Project Structure

```
app/
├── (dashboard)/
│   └── page.tsx              # Dashboard with charts
├── transactions/
│   ├── page.tsx              # Transaction list (paginated)
│   ├── new/
│   │   └── page.tsx          # Create transaction form
│   └── [id]/
│       └── page.tsx          # Edit transaction form
├── categories/
│   └── page.tsx              # Category management
├── api/
│   └── transactions/
│       └── export/
│           └── route.ts      # CSV export endpoint
├── components/
│   ├── ui/                   # Reusable UI primitives
│   ├── transactions/         # Transaction-specific components
│   ├── dashboard/            # Dashboard charts and cards
│   ├── categories/           # Category-specific components
│   └── layout/               # Navigation, sidebar
├── lib/
│   ├── actions/              # Server Actions
│   │   ├── transaction.ts
│   │   └── category.ts
│   ├── services/             # Data access layer
│   │   ├── transaction.ts
│   │   └── category.ts
│   ├── validations/          # Zod schemas
│   │   ├── transaction.ts
│   │   └── category.ts
│   ├── types.ts              # Shared TypeScript types
│   ├── db.ts                 # Prisma client singleton
│   ├── utils.ts              # General utilities
│   └── format.ts             # VND formatting, date formatting
├── hooks/                    # Custom React hooks
├── layout.tsx                # Root layout with navigation
├── globals.css               # Tailwind CSS imports
├── loading.tsx               # Global loading skeleton
├── error.tsx                 # Global error boundary
└── not-found.tsx             # 404 page

prisma/
├── schema.prisma             # Database schema
└── seed.ts                   # Default categories seed

public/                       # Static assets
```

## Verification Steps

After setup, verify the application works:

1. **Dashboard loads**: Navigate to `/` — should show empty state
   with zero totals
2. **Create transaction**: Go to `/transactions/new`, fill the form,
   submit — transaction appears in list
3. **View categories**: Go to `/categories` — default categories
   are listed
4. **Dashboard updates**: After adding transactions, dashboard
   shows correct totals and charts

## Environment Variables

Create `.env` in project root (already in `.gitignore`):

```env
# Database
DATABASE_URL="file:./dev.db"
```

No other environment variables are required for local development.

## Technology Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Framework  | Next.js 16 (App Router)        |
| Language   | TypeScript 5 (strict mode)     |
| UI         | React 19 + Tailwind CSS 4      |
| Database   | SQLite (dev) / PostgreSQL (prod) |
| ORM        | Prisma                         |
| Validation | Zod                            |
| Charts     | Recharts                       |
| Dates      | date-fns                       |
