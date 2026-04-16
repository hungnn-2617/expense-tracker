# Expense Tracker

A personal finance management application built with Next.js 16, React 19, and TypeScript. Track income and expenses, visualize spending patterns, and export financial data — all from a clean, responsive interface.

## Features

### Transaction Management
- Record income and expense transactions with amount, category, date, and description
- Edit or delete existing transactions with confirmation prompts
- Paginated transaction list sorted by most recent
- All monetary values displayed in Vietnamese Dong (VND)

### Dashboard & Analytics
- Summary cards showing total income, total expenses, and net balance
- Pie chart breaking down expenses by category
- Bar chart comparing income vs. expenses over time
- Toggle between daily, weekly, and monthly views

### Category Management
- 12 pre-loaded default categories (8 expense, 4 income) in Vietnamese
- Create custom categories with name, emoji icon, and color
- Edit or delete custom categories (defaults are protected)
- Deleted categories gracefully cascade — transactions become "Uncategorized"

### Filter & Search
- Filter transactions by date range, type (income/expense), and category
- Search transactions by description with debounced input
- All filters are URL-driven and composable

### CSV Export
- Export the currently filtered transaction list as a CSV file
- Columns: Date, Type, Category, Description, Amount
- Handles empty results with an informational message

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Next.js 16 (App Router)             |
| Language     | TypeScript 5 (strict mode)          |
| UI           | React 19 + Tailwind CSS 4           |
| Database     | SQLite (dev) / PostgreSQL (prod)    |
| ORM          | Prisma 6                            |
| Validation   | Zod                                 |
| Charts       | Recharts                            |
| Date Utility | date-fns                            |

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Initialize the database and seed default categories
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command              | Description                     |
|----------------------|---------------------------------|
| `pnpm dev`           | Start development server        |
| `pnpm build`         | Create production build         |
| `pnpm start`         | Start production server         |
| `pnpm lint`          | Run ESLint                      |
| `pnpm prisma studio` | Open database GUI               |

## Project Structure

```
app/
├── (dashboard)/          # Dashboard page with charts
├── transactions/         # Transaction CRUD pages
├── categories/           # Category management page
├── api/transactions/     # CSV export route handler
├── components/           # Reusable UI and feature components
├── lib/
│   ├── actions/          # Server Actions (mutations)
│   ├── services/         # Data access layer
│   ├── validations/      # Zod schemas
│   ├── db.ts             # Prisma client singleton
│   ├── types.ts          # Shared TypeScript types
│   ├── format.ts         # VND and date formatters
│   └── csv.ts            # CSV generation utility
└── hooks/                # Custom React hooks

prisma/
├── schema.prisma         # Database schema
└── seed.ts               # Default category seed data
```

## Architecture

- **Server Components** handle all data fetching — no client-side state management for read operations
- **Server Actions** with Zod validation handle all mutations
- **URL search params** drive filter and pagination state, making views shareable and bookmarkable
- **Prisma ORM** ensures type-safe, parameterized queries (no raw SQL)
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy) configured via `next.config.ts`

## License

Private project.
