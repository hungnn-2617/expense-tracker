# Research: Expense Tracker

**Branch**: `001-expense-tracker` | **Date**: 2026-04-16

## 1. Storage Strategy

**Decision**: Prisma ORM + SQLite (development), PostgreSQL-ready for production

**Rationale**:
- Spec requires data persistence across browser sessions (SC-007)
- Spec requires pagination (FR-004), filtering (FR-011–FR-014), and
  search (FR-014) — all are better served by SQL queries than
  client-side storage
- Prisma provides type-safe, parameterized queries — satisfying
  Constitution Principle IV (OWASP: no raw SQL, no injection risk)
- SQLite requires zero infrastructure for local development
- Schema can be swapped to PostgreSQL via a single `provider` change
  in `schema.prisma` for production deployment

**Alternatives considered**:
- **localStorage**: Rejected — limited to 5–10 MB, no query support,
  pagination/filtering must be implemented in-memory
- **IndexedDB (via Dexie.js)**: Rejected — good for offline-first
  apps, but complex query patterns and no server-side rendering support
- **PostgreSQL from start**: Rejected — overkill for single-user MVP;
  adds Docker/service dependency for local dev

## 2. Charting Library

**Decision**: Recharts

**Rationale**:
- Built natively for React with declarative JSX API
- Supports pie charts (FR-008) and bar charts (FR-009) out of the box
- Good TypeScript support and tree-shakeable
- Active maintenance and large community
- Lightweight enough for a personal finance app

**Alternatives considered**:
- **Chart.js + react-chartjs-2**: Rejected — imperative API wrapped
  in React; less idiomatic with Server Components (requires `"use client"`)
- **Nivo**: Rejected — heavier bundle size; more suitable for
  data-heavy dashboards
- **Victory**: Rejected — similar capability but smaller community

Note: Recharts requires `"use client"` — chart components will be
client components per Constitution Principle III.

## 3. Form Validation

**Decision**: Zod for server-side validation, native HTML5 for
client-side UX

**Rationale**:
- Zod is already a transitive dependency (via Next.js 16)
- Provides runtime type validation on server (Constitution Principle IV:
  server-side validation mandatory)
- Schema definitions can be shared between client and server
- Works seamlessly with Server Actions and React 19 `useActionState`
- TypeScript inference from Zod schemas ensures type safety

**Alternatives considered**:
- **Yup**: Rejected — less TypeScript-native than Zod
- **Valibot**: Rejected — smaller ecosystem, though lighter bundle
- **Manual validation**: Rejected — error-prone, harder to maintain

## 4. Date Handling

**Decision**: date-fns

**Rationale**:
- Tree-shakeable — only import functions used (e.g., `format`,
  `startOfWeek`, `startOfMonth`, `eachDayOfInterval`)
- Needed for dashboard time groupings (daily/weekly/monthly — FR-010)
- Immutable by design; pure functions
- Excellent TypeScript support

**Alternatives considered**:
- **dayjs**: Rejected — plugin-based API is less tree-shakeable
- **Native Date + Intl**: Rejected — insufficient for week/month
  grouping logic without significant boilerplate
- **Luxon**: Rejected — heavier than needed for this use case

## 5. CSV Export

**Decision**: Custom utility using Blob API

**Rationale**:
- Export requirements are simple: fixed columns (Date, Type, Category,
  Description, Amount) per FR-015
- No complex CSV features needed (no nested data, no streaming)
- Avoids adding a dependency for ~20 lines of code
- Client-side download via `URL.createObjectURL` + anchor click

**Alternatives considered**:
- **papaparse**: Rejected — powerful but overkill for simple
  column-based export
- **Server-side generation**: Rejected — unnecessary network round-trip
  for data already on client

## 6. UI Component Strategy

**Decision**: Custom components with Tailwind CSS 4 + Headless UI
(Radix UI primitives where needed)

**Rationale**:
- Tailwind CSS 4 already configured in the project
- Custom components ensure minimal bundle size and full control
- Radix UI primitives (Dialog, Select, Popover) provide accessibility
  without opinionated styling — aligns with Constitution Principle I
  (simplicity) and FR-018 (responsive)
- No full component library needed for this scope

**Alternatives considered**:
- **shadcn/ui**: Considered — good option but adds many files for a
  small app; may be adopted later if scope grows
- **Material UI**: Rejected — heavy bundle, opinionated styling
- **Chakra UI**: Rejected — runtime CSS-in-JS conflicts with
  Tailwind approach

## 7. State Management

**Decision**: React Server Components + React 19 `useActionState` +
URL search params for filter state

**Rationale**:
- Server Components handle data fetching (no client-side state needed
  for read operations)
- Server Actions + `useActionState` handle mutations with built-in
  optimistic updates
- URL search params for filters ensure shareable/bookmarkable URLs
  and work with Server Components
- No external state library needed — Constitution Principle I (YAGNI)

**Alternatives considered**:
- **Zustand**: Rejected — adds client-side state management when
  Server Components already handle it
- **React Context**: May be used sparingly for UI-only state (e.g.,
  sidebar open/close) but not for data

## 8. Number Formatting (VND)

**Decision**: `Intl.NumberFormat` with locale `vi-VN` and
currency `VND`

**Rationale**:
- Native browser API — zero bundle cost
- Handles thousands separators and VND suffix correctly
- Consistent with FR-017 requirement
- Works on both server and client

**Alternatives considered**:
- **Custom formatter**: Rejected — reimplements what the platform
  already provides
