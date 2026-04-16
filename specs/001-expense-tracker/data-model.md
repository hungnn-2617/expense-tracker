# Data Model: Expense Tracker

**Branch**: `001-expense-tracker` | **Date**: 2026-04-16

## Entities

### Category

Represents a classification for transactions. Categories are either
system-default or user-created.

| Field       | Type     | Constraints                              |
|-------------|----------|------------------------------------------|
| id          | String   | Primary key, CUID                        |
| name        | String   | Required, max 50 chars, unique per type  |
| type        | Enum     | `INCOME` or `EXPENSE`, required          |
| icon        | String   | Emoji character, required                |
| color       | String   | Hex color code (e.g., `#FF5733`), required |
| isDefault   | Boolean  | `true` for system-provided categories    |
| createdAt   | DateTime | Auto-set on creation                     |
| updatedAt   | DateTime | Auto-set on update                       |

**Validation rules**:
- `name` MUST be non-empty and unique within the same `type`
- `color` MUST match hex pattern `^#[0-9A-Fa-f]{6}$`
- `icon` MUST be a single emoji character
- System-default categories (`isDefault: true`) MUST NOT be deletable

**Relationships**:
- One Category → Many Transactions

### Transaction

Represents a single financial record (income or expense).

| Field       | Type     | Constraints                              |
|-------------|----------|------------------------------------------|
| id          | String   | Primary key, CUID                        |
| type        | Enum     | `INCOME` or `EXPENSE`, required          |
| amount      | Int      | Positive integer (VND), required         |
| description | String   | Optional, max 255 chars                  |
| date        | DateTime | Required, date of transaction            |
| categoryId  | String   | Foreign key → Category, nullable         |
| createdAt   | DateTime | Auto-set on creation                     |
| updatedAt   | DateTime | Auto-set on update                       |

**Validation rules**:
- `amount` MUST be a positive integer (> 0) per FR-016
- `amount` is stored in VND (no decimals needed)
- `date` MUST be a valid date, not in the future
- `description` is optional; if provided, max 255 characters
- `categoryId` becomes `null` if the referenced category is deleted
  (edge case: "Uncategorized" display in UI)

**Relationships**:
- Many Transactions → One Category (nullable, `onDelete: SetNull`)

## Prisma Schema

```prisma
enum TransactionType {
  INCOME
  EXPENSE
}

model Category {
  id           String          @id @default(cuid())
  name         String
  type         TransactionType
  icon         String
  color        String
  isDefault    Boolean         @default(false)
  transactions Transaction[]
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt

  @@unique([name, type])
  @@map("categories")
}

model Transaction {
  id          String          @id @default(cuid())
  type        TransactionType
  amount      Int
  description String?
  date        DateTime
  categoryId  String?
  category    Category?       @relation(fields: [categoryId],
                               references: [id],
                               onDelete: SetNull)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  @@index([date])
  @@index([type])
  @@index([categoryId])
  @@map("transactions")
}
```

## Default Categories (Seed Data)

### Expense Categories

| Name             | Icon | Color   |
|------------------|------|---------|
| Ăn uống         | 🍜   | #FF6B6B |
| Di chuyển        | 🚗   | #4ECDC4 |
| Mua sắm         | 🛍️   | #45B7D1 |
| Giải trí        | 🎮   | #96CEB4 |
| Hóa đơn         | 📄   | #FFEAA7 |
| Sức khỏe        | 💊   | #DDA0DD |
| Giáo dục        | 📚   | #98D8C8 |
| Khác (chi)      | 📦   | #AEB6BF |

### Income Categories

| Name             | Icon | Color   |
|------------------|------|---------|
| Lương            | 💰   | #2ECC71 |
| Freelance        | 💻   | #3498DB |
| Đầu tư          | 📈   | #E74C3C |
| Khác (thu)      | 🎁   | #F39C12 |

## State Transitions

### Category Lifecycle

```
Created → Active → Deleted (soft: transactions set to null categoryId)
```

- Default categories cannot transition to Deleted
- Custom categories can be deleted only if user confirms

### Transaction Lifecycle

```
Created → Active → Edited → Active
                 → Deleted (hard delete with confirmation)
```

- Transactions are hard-deleted (no soft delete for simplicity)
- Deletion requires user confirmation (FR-003)

## Query Patterns

| Operation                        | Access Pattern                                |
|----------------------------------|-----------------------------------------------|
| List transactions (paginated)    | `ORDER BY date DESC, LIMIT/OFFSET`            |
| Filter by date range             | `WHERE date >= start AND date <= end`         |
| Filter by type                   | `WHERE type = ?`                              |
| Filter by category               | `WHERE categoryId = ?`                        |
| Search by description            | `WHERE description LIKE '%query%'` (case-insensitive) |
| Combined filters                 | All WHERE clauses composable                  |
| Dashboard: totals by period      | `SUM(amount) GROUP BY type WHERE date BETWEEN` |
| Dashboard: by category           | `SUM(amount) GROUP BY categoryId WHERE type = EXPENSE` |
| Dashboard: over time             | `SUM(amount) GROUP BY date_trunc(period)`     |
| List categories by type          | `WHERE type = ? ORDER BY name`                |

**Index justification**:
- `transactions.date`: Primary sort and filter field
- `transactions.type`: Frequent filter dimension
- `transactions.categoryId`: JOIN and filter field
- `categories.(name, type)`: Unique constraint for dedup
