# API Route Contracts: Expense Tracker

**Branch**: `001-expense-tracker` | **Date**: 2026-04-16

This document defines the Route Handler contracts and Server Action
interfaces for the Expense Tracker application.

## Architecture Overview

- **Read operations**: Server Components fetch data directly via
  service functions (no API route needed)
- **Write operations**: Server Actions (`'use server'`) for form
  mutations
- **Route Handlers**: Used for CSV export (file download) and any
  endpoint that needs direct HTTP access

---

## Server Actions (Mutations)

### Transaction Actions

Location: `app/lib/actions/transaction.ts`

#### `createTransaction(formData: FormData)`

Creates a new transaction.

**Input (FormData)**:
```
type: "INCOME" | "EXPENSE"       (required)
amount: string → parsed to int   (required, > 0)
categoryId: string               (required, valid category ID)
date: string                     (required, ISO date)
description: string              (optional, max 255 chars)
```

**Validation (Zod)**:
```typescript
{
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.coerce.number().int().positive(),
  categoryId: z.string().cuid(),
  date: z.coerce.date(),
  description: z.string().max(255).optional(),
}
```

**Success**: Revalidates `/transactions` path, returns `{ success: true }`
**Error**: Returns `{ success: false, errors: Record<string, string[]> }`

---

#### `updateTransaction(id: string, formData: FormData)`

Updates an existing transaction.

**Input**: Same fields as `createTransaction` + transaction `id`

**Validation**: Same as `createTransaction` + `id` must exist

**Success**: Revalidates `/transactions` path, returns `{ success: true }`
**Error**: Returns `{ success: false, errors: Record<string, string[]> }`

---

#### `deleteTransaction(id: string)`

Deletes a transaction permanently.

**Input**:
```
id: string   (required, valid CUID)
```

**Success**: Revalidates `/transactions` path, returns `{ success: true }`
**Error**: Returns `{ success: false, error: string }`

---

### Category Actions

Location: `app/lib/actions/category.ts`

#### `createCategory(formData: FormData)`

Creates a new custom category.

**Input (FormData)**:
```
name: string          (required, max 50 chars)
type: "INCOME" | "EXPENSE"   (required)
icon: string          (required, emoji)
color: string         (required, hex color)
```

**Validation (Zod)**:
```typescript
{
  name: z.string().min(1).max(50),
  type: z.enum(["INCOME", "EXPENSE"]),
  icon: z.string().emoji(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
}
```

**Unique constraint**: `(name, type)` must be unique
**Success**: Revalidates `/categories` path
**Error**: Returns validation errors or unique constraint error

---

#### `updateCategory(id: string, formData: FormData)`

Updates an existing category.

**Input**: Same as `createCategory` + category `id`
**Constraint**: Default categories (`isDefault: true`) MUST NOT be
editable (return error)

---

#### `deleteCategory(id: string)`

Deletes a custom category. Associated transactions get `categoryId`
set to `null`.

**Input**:
```
id: string   (required, valid CUID)
```

**Constraint**: Default categories MUST NOT be deletable
**Success**: Revalidates `/categories` and `/transactions` paths
**Error**: Returns error if category is default

---

## Route Handlers (HTTP Endpoints)

### CSV Export

#### `GET /api/transactions/export`

Location: `app/api/transactions/export/route.ts`

Downloads filtered transactions as a CSV file.

**Query Parameters**:
```
dateFrom?: string     (ISO date, optional)
dateTo?: string       (ISO date, optional)
type?: "INCOME" | "EXPENSE"   (optional)
categoryId?: string   (optional)
search?: string       (optional, description search)
```

**Response (200)**:
```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="expenses_2026-04-16.csv"

Date,Type,Category,Description,Amount
2026-04-16,Expense,Ăn uống,Lunch,150000
...
```

**Response (204)**: No transactions match filters (empty result)

**Response (400)**: Invalid query parameters

**Validation**: All query params validated with Zod before querying

---

## Service Functions (Data Access Layer)

Location: `app/lib/services/`

These are NOT API endpoints — they are server-side functions called
directly from Server Components and Server Actions.

### `transactionService.ts`

```typescript
getTransactions(filters: TransactionFilters): Promise<PaginatedResult<Transaction>>
getTransactionById(id: string): Promise<Transaction | null>
getDashboardSummary(period: Period, date: Date): Promise<DashboardSummary>
getCategoryBreakdown(period: Period, date: Date): Promise<CategoryBreakdown[]>
getTimeSeriesData(period: Period, date: Date): Promise<TimeSeriesPoint[]>
```

**TransactionFilters**:
```typescript
{
  page?: number          // default: 1
  pageSize?: number      // default: 10
  dateFrom?: Date
  dateTo?: Date
  type?: TransactionType
  categoryId?: string
  search?: string        // partial match on description
}
```

**PaginatedResult**:
```typescript
{
  data: Transaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

### `categoryService.ts`

```typescript
getCategories(type?: TransactionType): Promise<Category[]>
getCategoryById(id: string): Promise<Category | null>
```

---

## Shared Types

Location: `app/lib/types.ts`

```typescript
type TransactionType = "INCOME" | "EXPENSE"

type Period = "daily" | "weekly" | "monthly"

interface DashboardSummary {
  totalIncome: number
  totalExpenses: number
  netBalance: number
}

interface CategoryBreakdown {
  categoryId: string | null
  categoryName: string
  categoryColor: string
  categoryIcon: string
  total: number
  percentage: number
}

interface TimeSeriesPoint {
  label: string       // e.g., "2026-04-16", "W15", "Apr"
  income: number
  expense: number
}
```

---

## URL Structure (Pages)

| Route                | Page                  | Description                    |
|----------------------|-----------------------|--------------------------------|
| `/`                  | Dashboard             | Redirect or dashboard home     |
| `/dashboard`         | Dashboard             | Summary cards + charts         |
| `/transactions`      | Transaction List      | Paginated, filterable list     |
| `/transactions/new`  | New Transaction       | Create transaction form        |
| `/transactions/[id]` | Edit Transaction      | Edit transaction form          |
| `/categories`        | Category Management   | List, create, edit, delete     |
