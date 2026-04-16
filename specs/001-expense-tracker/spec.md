# Feature Specification: Expense Tracker - Personal Expense Management

**Feature Branch**: `001-expense-tracker`  
**Created**: 2026-04-16  
**Status**: Draft  
**Input**: User description: "Viết spec chi tiết cho ứng dụng Expense Tracker với các tính năng: quản lý transactions (thu/chi), categories, dashboard theo ngày/tuần/tháng, filter, search, export CSV."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record Income and Expense Transactions (Priority: P1)

As a user, I want to quickly record my daily income and expense transactions so that I can keep track of where my money goes. I open the application, click "Add Transaction", select the type (income or expense), choose a category, enter the amount and an optional description, pick the date, and save. The transaction appears immediately in my transaction list.

**Why this priority**: This is the core functionality of the application. Without the ability to record transactions, no other feature (dashboard, reports, export) can function. This alone delivers a viable MVP.

**Independent Test**: Can be fully tested by creating several income and expense transactions and verifying they appear in the transaction list with correct details (amount, type, category, date, description).

**Acceptance Scenarios**:

1. **Given** the user is on the transactions page, **When** they click "Add Transaction" and fill in type as "expense", category as "Food & Dining", amount as 150000, description as "Lunch", date as today, and submit, **Then** the transaction is saved and appears in the transaction list with all correct details.
2. **Given** the user is on the transactions page, **When** they click "Add Transaction" and fill in type as "income", category as "Salary", amount as 15000000, date as today, and submit without a description, **Then** the transaction is saved successfully with an empty description.
3. **Given** the user has an existing transaction, **When** they click edit on that transaction and change the amount, **Then** the updated amount is reflected in the list.
4. **Given** the user has an existing transaction, **When** they click delete and confirm the action, **Then** the transaction is removed from the list permanently.

---

### User Story 2 - View Spending Dashboard (Priority: P2)

As a user, I want to see an overview dashboard of my financial activity so that I can understand my spending patterns at a glance. The dashboard shows summary cards (total income, total expenses, net balance) and visual charts (pie chart by category, bar chart over time). I can switch between daily, weekly, and monthly views.

**Why this priority**: The dashboard transforms raw transaction data into actionable insights. It is the primary value-add beyond simple record keeping and the main reason users return to the app daily.

**Independent Test**: Can be tested by adding a set of sample transactions across different categories and dates, then verifying the dashboard correctly displays summary totals, pie chart breakdown by category, and bar chart grouped by the selected time period (day/week/month).

**Acceptance Scenarios**:

1. **Given** the user has recorded 5 expense transactions and 2 income transactions this month, **When** they navigate to the dashboard with "monthly" view selected, **Then** they see correct total income, total expenses, and net balance for the current month, a pie chart showing expense distribution by category, and a bar chart showing income vs expense over the month.
2. **Given** the user is viewing the monthly dashboard, **When** they switch to "weekly" view, **Then** the bar chart updates to show data grouped by week and the summary cards reflect the current week's totals.
3. **Given** the user has no transactions for the current period, **When** they view the dashboard, **Then** they see zero values for all summary cards and an empty state message on the charts.

---

### User Story 3 - Manage Categories (Priority: P3)

As a user, I want to organize my transactions into categories so that I can classify spending and income meaningfully. The app comes with a set of default categories (e.g., Food & Dining, Transportation, Shopping, Entertainment, Salary, Freelance), and I can create custom categories with a chosen icon and color.

**Why this priority**: Categories are essential for meaningful reporting but the system works with default categories alone. Custom category management enhances the user experience but is not blocking for the MVP.

**Independent Test**: Can be tested by viewing the pre-loaded default categories, creating a new custom category with a name, icon, and color, editing an existing category, and deleting a custom category, then verifying each action persists correctly.

**Acceptance Scenarios**:

1. **Given** the user opens the categories page for the first time, **When** the page loads, **Then** they see a list of pre-loaded default categories for both income and expense types, each with an icon and color.
2. **Given** the user is on the categories page, **When** they create a new category with name "Pets", type "expense", icon, and color, **Then** the new category appears in the list and is available when creating transactions.
3. **Given** the user has a custom category with no associated transactions, **When** they delete it, **Then** the category is removed from the list.

---

### User Story 4 - Filter and Search Transactions (Priority: P4)

As a user, I want to filter and search through my transactions so that I can find specific records quickly. I can filter by date range, transaction type (income/expense), and category. I can also search by description text.

**Why this priority**: Filtering and search become important as the transaction list grows, but the app is still usable without them for users with fewer records.

**Independent Test**: Can be tested by creating 20+ transactions with varied dates, types, categories, and descriptions, then applying each filter individually and in combination to verify correct results.

**Acceptance Scenarios**:

1. **Given** the user has transactions spanning 3 months, **When** they filter by date range "March 1 - March 31", **Then** only March transactions are shown.
2. **Given** the user has both income and expense transactions, **When** they filter by type "expense", **Then** only expense transactions are shown.
3. **Given** the user has transactions with description "Coffee at Highlands", **When** they search for "Highlands", **Then** transactions containing "Highlands" in the description are shown.
4. **Given** the user applies date range filter and category filter simultaneously, **When** results are displayed, **Then** only transactions matching both criteria are shown.

---

### User Story 5 - Export Transactions to CSV (Priority: P5)

As a user, I want to export my filtered transaction list to a CSV file so that I can use the data in spreadsheets or share it with others. The exported file contains columns for date, type, category name, description, and amount.

**Why this priority**: Export is a convenience feature for advanced users. It enhances the app but is not required for day-to-day expense tracking.

**Independent Test**: Can be tested by applying filters to the transaction list, clicking "Export CSV", and verifying the downloaded file opens correctly in a spreadsheet application with all expected columns and data matching the filtered view.

**Acceptance Scenarios**:

1. **Given** the user has 10 transactions displayed (after optional filtering), **When** they click "Export CSV", **Then** a CSV file is downloaded with filename format "expenses_YYYY-MM-DD.csv" containing 10 rows plus a header row with columns: Date, Type, Category, Description, Amount.
2. **Given** the user has filtered transactions to show only expenses in "Food & Dining" category, **When** they export, **Then** the CSV contains only the filtered transactions, not all transactions.
3. **Given** the user has no transactions (empty list), **When** they click "Export CSV", **Then** the system shows a message indicating there is nothing to export.

---

### Edge Cases

- What happens when a user tries to create a transaction with amount zero or negative? The system must reject it and display a validation error.
- What happens when a user deletes a category that has associated transactions? The transactions remain but their category reference is cleared (set to "Uncategorized" or null).
- What happens when the user has thousands of transactions? The transaction list must use pagination to maintain performance.
- How does the dashboard handle a period with only income and no expenses (or vice versa)? Charts should render correctly with partial data, showing zero for the missing type.
- What happens if the user's browser does not support file downloads? The export button should gracefully degrade or show an informational message.
- What happens when a user searches with special characters? The search should handle them without errors.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create transactions with the following fields: type (income/expense), amount (positive number), category, date, and optional description.
- **FR-002**: System MUST allow users to edit any field of an existing transaction.
- **FR-003**: System MUST allow users to delete a transaction with a confirmation prompt.
- **FR-004**: System MUST display transactions in a paginated list, ordered by date (most recent first), showing 10 items per page by default.
- **FR-005**: System MUST provide a set of pre-loaded default categories for both income and expense types, each with a name, icon (emoji), and color.
- **FR-006**: System MUST allow users to create, edit, and delete custom categories.
- **FR-007**: System MUST display a dashboard with three summary cards: total income, total expenses, and net balance for the selected time period.
- **FR-008**: System MUST display a pie chart showing expense distribution by category for the selected time period.
- **FR-009**: System MUST display a bar chart showing income vs expense grouped by the selected time unit (day, week, or month).
- **FR-010**: System MUST allow users to switch dashboard view between daily, weekly, and monthly groupings.
- **FR-011**: System MUST allow users to filter transactions by date range.
- **FR-012**: System MUST allow users to filter transactions by type (income, expense, or all).
- **FR-013**: System MUST allow users to filter transactions by category.
- **FR-014**: System MUST allow users to search transactions by description text (partial, case-insensitive match).
- **FR-015**: System MUST allow users to export the currently displayed (filtered) transactions as a CSV file with columns: Date, Type, Category, Description, Amount.
- **FR-016**: System MUST validate that transaction amount is a positive number before saving.
- **FR-017**: System MUST display all monetary amounts in Vietnamese Dong (VND) format with thousands separator.
- **FR-018**: System MUST provide a responsive layout that works on both desktop and mobile screens.
- **FR-019**: System MUST provide a navigation sidebar (or mobile drawer) with links to Dashboard, Transactions, and Categories pages.

### Key Entities

- **Transaction**: Represents a single financial record. Key attributes: amount, type (income or expense), associated category, date of transaction, optional description, and timestamps for creation and last update. A transaction always belongs to one category (or none if the category was deleted).
- **Category**: Represents a classification for transactions. Key attributes: name, type (income or expense), visual icon (emoji), display color. Categories can be system-default or user-created. A category can have many associated transactions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can record a new transaction in under 30 seconds (from clicking "Add" to seeing it in the list).
- **SC-002**: Dashboard loads and displays charts within 2 seconds for a user with up to 1,000 transactions.
- **SC-003**: Users can find a specific transaction using filters or search within 10 seconds.
- **SC-004**: 95% of users can successfully create their first transaction without external guidance.
- **SC-005**: CSV export completes and downloads within 3 seconds for up to 1,000 transactions.
- **SC-006**: Application is fully usable on mobile screens (minimum 320px width) without horizontal scrolling.
- **SC-007**: All transaction data persists across browser sessions and page reloads without data loss.

## Assumptions

- Users are individuals tracking personal finances (single-user application, no multi-user/team support needed).
- Users have a modern web browser with JavaScript enabled and stable internet connectivity.
- The application uses Vietnamese Dong (VND) as the sole currency; multi-currency support is out of scope.
- Authentication is not required for the initial version; the app operates with anonymous/public access for simplicity.
- The application targets a single user managing up to a few thousand transactions; enterprise-scale data volumes are out of scope.
- Default categories are provided in Vietnamese language matching common expense/income types in Vietnam.
- Mobile-responsive web design is sufficient; a native mobile app is out of scope.
