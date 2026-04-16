# Tasks: Expense Tracker

**Input**: Design documents from `/specs/001-expense-tracker/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api-routes.md

**Tests**: Not explicitly requested in feature specification. Skipped.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, initialize Prisma, and create base configuration

- [ ] T001 Install project dependencies: prisma, @prisma/client, recharts, zod, date-fns, and @radix-ui/react-dialog via `pnpm add`
- [ ] T002 [P] Create Prisma schema with TransactionType enum, Category model, and Transaction model (with indexes and relations) at prisma/schema.prisma per data-model.md
- [ ] T003 [P] Create shared TypeScript types (TransactionType, Period, DashboardSummary, CategoryBreakdown, TimeSeriesPoint, PaginatedResult, TransactionFilters, ActionState) at app/lib/types.ts per contracts/api-routes.md
- [ ] T004 [P] Create Prisma client singleton with global caching for development at app/lib/db.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database initialization, seed data, validation schemas, services, UI primitives, and app shell

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Generate Prisma client and push schema to SQLite database via `pnpm prisma generate && pnpm prisma db push`
- [ ] T006 Create seed script with 12 default Vietnamese categories (8 expense + 4 income) at prisma/seed.ts per data-model.md seed data table
- [ ] T007 Configure prisma.seed in package.json and run `pnpm prisma db seed` to populate default categories
- [ ] T008 [P] Create VND currency formatter (using Intl.NumberFormat vi-VN) and date formatters at app/lib/format.ts
- [ ] T009 [P] Create general utility functions (cn for classnames, generateCsvFilename) at app/lib/utils.ts
- [ ] T010 [P] Create Zod validation schema for transaction (type, amount, categoryId, date, description) at app/lib/validations/transaction.ts per contracts/api-routes.md
- [ ] T011 [P] Create Zod validation schema for category (name, type, icon, color) at app/lib/validations/category.ts per contracts/api-routes.md
- [ ] T012 [P] Create category service with getCategories(type?) and getCategoryById(id) at app/lib/services/category.ts per contracts/api-routes.md
- [ ] T013 [P] Create transaction service with getTransactions(filters) and getTransactionById(id) returning PaginatedResult at app/lib/services/transaction.ts per contracts/api-routes.md
- [ ] T014 Create reusable UI components (Button, Input, Select, Card, Modal, Pagination) at app/components/ui/ with Tailwind CSS 4 styling and responsive design
- [ ] T015 Create root layout with sidebar navigation (links to Dashboard, Transactions, Categories) and mobile-responsive drawer at app/layout.tsx and app/components/layout/Sidebar.tsx per FR-019
- [ ] T016 [P] Create global boundary files: app/loading.tsx (skeleton), app/error.tsx (error boundary with "use client"), and app/not-found.tsx (404 page)

**Checkpoint**: Foundation ready — database seeded, services available, UI shell rendered

---

## Phase 3: User Story 1 — Record Income and Expense Transactions (Priority: P1) MVP

**Goal**: Users can create, view, edit, and delete transactions with pagination

**Independent Test**: Create several income/expense transactions and verify they appear in the paginated list with correct details (amount in VND, type, category, date, description). Edit a transaction and confirm the update. Delete a transaction and confirm removal.

### Implementation for User Story 1

- [ ] T017 [US1] Create transaction Server Actions (createTransaction, updateTransaction, deleteTransaction) with Zod validation and revalidatePath at app/lib/actions/transaction.ts per contracts/api-routes.md
- [ ] T018 [P] [US1] Create TransactionForm client component ("use client") with type selector, amount input, category dropdown, date picker, description field, and useActionState integration at app/components/transactions/TransactionForm.tsx
- [ ] T019 [P] [US1] Create TransactionRow component displaying formatted amount (VND), type badge, category icon+name, date, and description with edit/delete action buttons at app/components/transactions/TransactionRow.tsx
- [ ] T020 [US1] Create TransactionList component composing TransactionRow items with Pagination at app/components/transactions/TransactionList.tsx
- [ ] T021 [US1] Create transactions list page (Server Component) reading page from searchParams, calling getTransactions, rendering TransactionList at app/transactions/page.tsx with loading.tsx skeleton
- [ ] T022 [US1] Create new transaction page loading categories via getCategories, rendering TransactionForm with createTransaction action at app/transactions/new/page.tsx
- [ ] T023 [US1] Create edit transaction page loading transaction by id and categories, rendering TransactionForm with updateTransaction action at app/transactions/[id]/page.tsx
- [ ] T024 [US1] Add delete confirmation dialog (using Radix Dialog or Modal component) triggered from TransactionRow delete button, calling deleteTransaction Server Action
- [ ] T025 [US1] Create dashboard placeholder page that redirects to /transactions at app/(dashboard)/page.tsx (temporary until US2)

**Checkpoint**: User Story 1 fully functional — CRUD transactions with pagination. This is the MVP.

---

## Phase 4: User Story 2 — View Spending Dashboard (Priority: P2)

**Goal**: Dashboard displays summary cards (total income, total expenses, net balance) and charts (pie by category, bar over time) with daily/weekly/monthly switching

**Independent Test**: Add sample transactions across categories and dates. Navigate to dashboard with monthly view — verify correct totals, pie chart breakdown by category, and bar chart income vs expense over time. Switch to weekly/daily and verify data updates.

### Implementation for User Story 2

- [ ] T026 [US2] Add dashboard query functions (getDashboardSummary, getCategoryBreakdown, getTimeSeriesData) to app/lib/services/transaction.ts using date-fns for period grouping per contracts/api-routes.md
- [ ] T027 [P] [US2] Create SummaryCards component displaying total income, total expenses, and net balance formatted in VND at app/components/dashboard/SummaryCards.tsx
- [ ] T028 [P] [US2] Create ExpensePieChart client component ("use client") using Recharts PieChart with category colors and labels at app/components/dashboard/ExpensePieChart.tsx
- [ ] T029 [P] [US2] Create IncomeExpenseBarChart client component ("use client") using Recharts BarChart with income/expense grouped bars at app/components/dashboard/IncomeExpenseBarChart.tsx
- [ ] T030 [P] [US2] Create PeriodSelector client component ("use client") with daily/weekly/monthly toggle buttons updating URL searchParams at app/components/dashboard/PeriodSelector.tsx
- [ ] T031 [US2] Create EmptyState component for when no transactions exist in the selected period at app/components/dashboard/EmptyState.tsx
- [ ] T032 [US2] Replace dashboard placeholder with full dashboard page (Server Component) reading period from searchParams, calling dashboard services, rendering SummaryCards + PieChart + BarChart at app/(dashboard)/page.tsx
- [ ] T033 [US2] Update root layout navigation to highlight Dashboard as the home page and set root `/` to render dashboard

**Checkpoint**: Dashboard fully functional with all three visualizations and period switching

---

## Phase 5: User Story 3 — Manage Categories (Priority: P3)

**Goal**: Users can view default categories, create custom categories with name/icon/color, edit custom categories, and delete custom categories

**Independent Test**: View pre-loaded default categories. Create a new custom category with name, icon, and color — verify it appears in the list and is available in transaction form. Edit it. Delete it. Verify default categories cannot be deleted.

### Implementation for User Story 3

- [ ] T034 [US3] Create category Server Actions (createCategory, updateCategory, deleteCategory) with Zod validation, default-category protection, and revalidatePath at app/lib/actions/category.ts per contracts/api-routes.md
- [ ] T035 [P] [US3] Create CategoryForm client component ("use client") with name input, type selector, emoji icon picker, hex color picker, and useActionState at app/components/categories/CategoryForm.tsx
- [ ] T036 [P] [US3] Create CategoryRow component displaying icon, name, type badge, color swatch, and edit/delete buttons (delete disabled for defaults) at app/components/categories/CategoryRow.tsx
- [ ] T037 [US3] Create CategoryList component composing CategoryRow items grouped by type (Expense / Income) at app/components/categories/CategoryList.tsx
- [ ] T038 [US3] Create categories page (Server Component) loading categories via getCategories, rendering CategoryList and CategoryForm modal at app/categories/page.tsx
- [ ] T039 [US3] Handle category deletion cascade: when a category is deleted, associated transactions show "Không phân loại" (Uncategorized) in TransactionRow
- [ ] T040 [US3] Verify Categories navigation link in Sidebar is active and highlighted when on /categories

**Checkpoint**: Category management fully functional — default categories protected, custom CRUD works

---

## Phase 6: User Story 4 — Filter and Search Transactions (Priority: P4)

**Goal**: Users can filter transactions by date range, type, and category, and search by description text

**Independent Test**: Create 20+ transactions with varied dates, types, categories, and descriptions. Apply date range filter — verify only matching transactions shown. Apply type filter. Apply category filter. Search by keyword. Combine multiple filters and verify correct intersection results.

### Implementation for User Story 4

- [ ] T041 [US4] Extend getTransactions in app/lib/services/transaction.ts to support combined filtering (dateFrom, dateTo, type, categoryId, search with case-insensitive LIKE) composing Prisma where clauses
- [ ] T042 [P] [US4] Create useDebounce hook at app/hooks/useDebounce.ts for debouncing search input (300ms delay)
- [ ] T043 [P] [US4] Create FilterBar client component ("use client") with date range inputs, type select (All/Income/Expense), and category select dropdown updating URL searchParams at app/components/transactions/FilterBar.tsx
- [ ] T044 [US4] Create SearchInput client component ("use client") with debounced text input updating URL searchParams at app/components/transactions/SearchInput.tsx (uses useDebounce from T042)
- [ ] T045 [US4] Integrate FilterBar and SearchInput into transactions page: read all filter params from searchParams, pass to getTransactions, reset pagination to page 1 when filters change at app/transactions/page.tsx

**Checkpoint**: Filtering and search fully functional — all filters composable, URL-driven for shareability

---

## Phase 7: User Story 5 — Export Transactions to CSV (Priority: P5)

**Goal**: Users can export the currently filtered transaction list as a downloadable CSV file

**Independent Test**: Apply filters to transaction list, click "Export CSV", verify downloaded file opens in a spreadsheet with correct columns (Date, Type, Category, Description, Amount) and data matching the filtered view. Test empty export shows informational message.

### Implementation for User Story 5

- [ ] T046 [P] [US5] Create CSV generation utility function (array of transactions → CSV string with header row) at app/lib/csv.ts
- [ ] T047 [US5] Create CSV export route handler (GET /api/transactions/export) with Zod query param validation, filter support, and proper Content-Type/Content-Disposition headers at app/api/transactions/export/route.ts per contracts/api-routes.md
- [ ] T048 [US5] Add "Export CSV" button to transactions page that triggers download with current filter params as query string; show message when no transactions to export at app/components/transactions/ExportButton.tsx

**Checkpoint**: CSV export fully functional — filtered data exports correctly with Vietnamese content

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Responsive design, metadata, accessibility, and quality verification

- [ ] T049 [P] Ensure mobile-responsive layout (320px minimum width per SC-006): test Sidebar drawer, TransactionForm, FilterBar, Dashboard charts, and CategoryForm at all breakpoints
- [ ] T050 [P] Add metadata to all pages using Next.js Metadata API (static metadata export or generateMetadata) with proper titles and descriptions per Constitution Principle III
- [ ] T051 [P] Add HTTP security headers (Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Referrer-Policy) via next.config.ts headers configuration per Constitution Security Requirements
- [ ] T052 Run ESLint (`pnpm lint`) and fix all errors to achieve zero-error baseline per Constitution Principle V
- [ ] T053 Run TypeScript compiler (`pnpm tsc --noEmit`) and fix all type errors per Constitution Principle V

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion (T005 needs T002; T006 needs T005) — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 — core MVP
- **US2 (Phase 4)**: Depends on Phase 2; benefits from US1 data for testing
- **US3 (Phase 5)**: Depends on Phase 2; independent of US1/US2
- **US4 (Phase 6)**: Depends on Phase 2 + US1 (extends transactions page)
- **US5 (Phase 7)**: Depends on Phase 2 + US1 (adds export to transactions page); benefits from US4 filters
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — **no dependencies on other stories**
- **US2 (P2)**: Can start after Phase 2 — **independent** (reads same data as US1)
- **US3 (P3)**: Can start after Phase 2 — **independent** (different page, same models)
- **US4 (P4)**: Depends on US1 (extends app/transactions/page.tsx)
- **US5 (P5)**: Depends on US1 (adds button to transactions page); benefits from US4 filters

### Within Each User Story

- Server Actions / Services before UI components
- Components before page composition
- Core functionality before edge case handling
- Commit after each task or logical group

### Parallel Opportunities

- T002, T003, T004 can all run in parallel (Phase 1)
- T008–T013 can all run in parallel (Phase 2 services/validations)
- T018, T019 can run in parallel (Phase 3 components)
- T027, T028, T029, T030 can all run in parallel (Phase 4 dashboard components)
- T035, T036 can run in parallel (Phase 5 category components)
- T042, T043 can run in parallel (Phase 6 filter components)
- US2 and US3 can run in parallel (different pages, no shared files)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Record Transactions)
4. **STOP and VALIDATE**: Test CRUD + pagination end-to-end
5. Deploy/demo if ready — this alone delivers a viable expense tracker

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (Record Transactions) → **MVP** — core value delivered
3. US2 (Dashboard) → Data insights — main differentiator
4. US3 (Manage Categories) → Customization — enhanced UX
5. US4 (Filter & Search) → Discovery — power user feature
6. US5 (Export CSV) → Portability — advanced feature
7. Polish → Production readiness

### Parallel Team Strategy

With multiple developers after Phase 2:

- **Developer A**: US1 (Record Transactions) → US4 (Filters) → US5 (Export)
- **Developer B**: US2 (Dashboard) + US3 (Categories) in parallel
- Both converge at Polish phase

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- All file paths are relative to project root
- Server Components are the default; "use client" noted where required
- VND formatting uses `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`
