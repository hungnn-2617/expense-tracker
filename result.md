# Hướng dẫn hoàn thành bài thực hành Agentic Coding - Expense Tracker

## Tổng quan

- **Đề bài**: Expense Tracker - Ứng dụng quản lý chi tiêu cá nhân
- **Tech stack**: Next.js (fullstack), TypeScript, Supabase, Tailwind CSS
- **Deploy**: Vercel
- **SDD Tool**: SpecKit
- **MCP Server**: Context7 (tra cứu docs), Supabase MCP (quản lý DB)

---

## Phần 1: Setup môi trường

### Bước 1.1: Cài đặt công cụ cần thiết

```bash
# Cài Node.js (>= 18), nếu chưa có
brew install node

# Cài SpecKit CLI globally
npm install -g speckit

# Cài Supabase CLI
brew install supabase/tap/supabase
```

### Bước 1.2: Tạo project Next.js

**Prompt cho Agent (GitHub Copilot Agent Mode / Claude Code):**

> Khởi tạo project Next.js mới với TypeScript, Tailwind CSS, App Router. Tên project: expense-tracker. Sử dụng pnpm làm package manager.

```bash
npx create-next-app@latest expense-tracker --typescript --tailwind --app --use-pnpm --eslint
cd expense-tracker
```

### Bước 1.3: Cài đặt dependencies

**Prompt:**

> Cài đặt các dependencies cần thiết cho project Expense Tracker: supabase client, date-fns để xử lý ngày tháng, react-icons cho icons, recharts cho biểu đồ dashboard, và papaparse để export CSV.

```bash
pnpm add @supabase/supabase-js @supabase/ssr date-fns recharts papaparse
pnpm add -D @types/papaparse
```

### Bước 1.4: Setup Supabase

1. Truy cập [supabase.com](https://supabase.com), tạo tài khoản và project mới
2. Lưu lại `Project URL` và `anon key` từ Settings > API
3. Tạo file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Bước 1.5: Setup MCP Server - Context7

Thêm vào file cấu hình MCP (`.vscode/mcp.json` hoặc `~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

> **Lưu ý**: Context7 giúp tra cứu documentation của Next.js, Supabase, Recharts... trực tiếp trong quá trình coding mà không cần mở browser.

---

## Phần 2: SDD Flow với SpecKit

### Bước 2.1: Khởi tạo SpecKit

**Prompt:**

> Khởi tạo SpecKit trong project hiện tại để setup flow SDD (Spec-Driven Development).

```bash
speckit init
```

### Bước 2.2: Viết Spec cho Expense Tracker

Tạo file `specs/expense-tracker.md`:

**Prompt:**

> Viết spec chi tiết cho ứng dụng Expense Tracker với các tính năng: quản lý transactions (thu/chi), categories, dashboard theo ngày/tuần/tháng, filter, search, export CSV. Sử dụng format SpecKit.

**Nội dung spec mẫu:**

```markdown
# Expense Tracker Spec

## Overview
Ứng dụng quản lý chi tiêu cá nhân, cho phép người dùng theo dõi thu/chi,
phân loại giao dịch và xem báo cáo tổng hợp.

## Data Models

### Category
- id: UUID (PK)
- name: string (required)
- type: enum ["income", "expense"]
- icon: string (emoji)
- color: string (hex color)
- created_at: timestamp

### Transaction
- id: UUID (PK)
- amount: number (required, > 0)
- type: enum ["income", "expense"] (required)
- category_id: UUID (FK -> Category)
- description: string
- date: date (required)
- created_at: timestamp
- updated_at: timestamp

## Features

### F1: Quản lý Categories
- Hiển thị danh sách categories mặc định (Ăn uống, Di chuyển, Mua sắm, Giải trí, Lương, Freelance...)
- CRUD categories tùy chỉnh
- Mỗi category có icon (emoji) và color

### F2: Quản lý Transactions
- Tạo transaction mới (thu hoặc chi)
- Chọn category, nhập số tiền, mô tả, ngày
- Sửa / Xoá transaction
- Hiển thị danh sách transactions với pagination

### F3: Dashboard
- Tổng thu / tổng chi / số dư trong khoảng thời gian
- Biểu đồ tròn (pie chart) theo category
- Biểu đồ cột (bar chart) theo ngày/tuần/tháng
- Chuyển đổi view: ngày / tuần / tháng

### F4: Lọc và Tìm kiếm
- Lọc theo khoảng thời gian (date range)
- Lọc theo type (thu/chi)
- Lọc theo category
- Tìm kiếm theo description

### F5: Export CSV
- Export danh sách transactions đã lọc ra file CSV
- Bao gồm các cột: Ngày, Loại, Danh mục, Mô tả, Số tiền

## UI Pages
1. `/` - Dashboard (trang chủ)
2. `/transactions` - Danh sách & quản lý transactions
3. `/categories` - Quản lý categories
```

### Bước 2.3: Generate code từ Spec

**Prompt cho Agent:**

> Dựa trên spec trong file specs/expense-tracker.md, hãy tạo database schema cho Supabase (SQL migration), tạo các TypeScript types, và setup Supabase client.

---

## Phần 3: Triển khai từng Feature

### Bước 3.1: Database Schema

**Prompt:**

> Tạo file SQL migration cho Supabase với 2 bảng: categories và transactions. Bao gồm RLS policies cho phép anonymous access (để demo đơn giản). Thêm seed data cho categories mặc định.

**File mẫu `supabase/migrations/001_initial.sql`:**

```sql
-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  icon TEXT DEFAULT '📦',
  color TEXT DEFAULT '#6B7280',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category_id);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies (cho phép anonymous access để demo)
CREATE POLICY "Allow all on categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all on transactions" ON transactions FOR ALL USING (true);

-- Seed default categories
INSERT INTO categories (name, type, icon, color) VALUES
  ('Ăn uống', 'expense', '🍜', '#EF4444'),
  ('Di chuyển', 'expense', '🚗', '#F59E0B'),
  ('Mua sắm', 'expense', '🛒', '#8B5CF6'),
  ('Giải trí', 'expense', '🎮', '#EC4899'),
  ('Hoá đơn', 'expense', '📄', '#6366F1'),
  ('Sức khoẻ', 'expense', '💊', '#14B8A6'),
  ('Giáo dục', 'expense', '📚', '#F97316'),
  ('Khác (chi)', 'expense', '📦', '#6B7280'),
  ('Lương', 'income', '💰', '#10B981'),
  ('Freelance', 'income', '💻', '#3B82F6'),
  ('Đầu tư', 'income', '📈', '#8B5CF6'),
  ('Khác (thu)', 'income', '🎁', '#6B7280');
```

Chạy migration trên Supabase Dashboard (SQL Editor) hoặc qua CLI.

### Bước 3.2: Setup Supabase Client & Types

**Prompt:**

> Tạo Supabase client cho Next.js App Router (cả server và client component). Tạo TypeScript types cho Category và Transaction dựa trên database schema.

### Bước 3.3: Trang Dashboard (Feature F3)

**Prompt:**

> Tạo trang Dashboard (/) cho Expense Tracker với: 3 summary cards (tổng thu, tổng chi, số dư), pie chart phân bổ chi tiêu theo category (dùng recharts), bar chart thu/chi theo thời gian. Cho phép chuyển đổi view theo ngày/tuần/tháng. Sử dụng Tailwind CSS, responsive design. Fetch data từ Supabase.

### Bước 3.4: Trang Transactions (Feature F2 + F4)

**Prompt:**

> Tạo trang /transactions hiển thị danh sách giao dịch với: bảng transactions có pagination (10 items/page), form thêm/sửa transaction (modal dialog), nút xoá transaction có confirm, filter theo date range, type (thu/chi), category, ô search theo description. Sử dụng Tailwind CSS.

### Bước 3.5: Trang Categories (Feature F1)

**Prompt:**

> Tạo trang /categories hiển thị danh sách categories dạng grid cards. Mỗi card hiển thị icon, tên, type (thu/chi), color indicator. Cho phép thêm/sửa/xoá category. Form có emoji picker đơn giản và color picker.

### Bước 3.6: Export CSV (Feature F5)

**Prompt:**

> Thêm nút "Export CSV" vào trang /transactions. Khi click, export tất cả transactions đang hiển thị (sau khi lọc) ra file CSV với các cột: Ngày, Loại, Danh mục, Mô tả, Số tiền. Sử dụng thư viện papaparse. File tên: expenses_YYYY-MM-DD.csv

### Bước 3.7: Layout & Navigation

**Prompt:**

> Tạo layout chung cho app với sidebar navigation (responsive - ẩn trên mobile, hiện drawer khi click hamburger). Sidebar có logo "Expense Tracker", các menu items: Dashboard, Transactions, Categories. Highlight menu item đang active. Dùng Tailwind CSS với dark/light theme.

---

## Phần 4: Testing & Polish

### Bước 4.1: Kiểm tra các tính năng

**Prompt:**

> Kiểm tra và fix các lỗi trong ứng dụng: test thêm/sửa/xoá transaction, test filter và search, test export CSV, test responsive trên mobile, test chuyển đổi view dashboard. Đảm bảo không có lỗi TypeScript.

### Bước 4.2: Format số tiền VND

**Prompt:**

> Format tất cả số tiền trong app theo định dạng tiền Việt Nam (VND): sử dụng dấu chấm ngăn cách hàng nghìn, thêm ký hiệu "đ" ở cuối. Ví dụ: 1.500.000đ

---

## Phần 5: Deploy lên Vercel

### Bước 5.1: Push code lên GitHub

```bash
git init
git add .
git commit -m "feat: complete expense tracker app"
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git push -u origin main
```

### Bước 5.2: Deploy lên Vercel

1. Truy cập [vercel.com](https://vercel.com), đăng nhập bằng GitHub
2. Click "New Project" > Import repo `expense-tracker`
3. Thêm Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click "Deploy"

**Prompt (nếu cần fix lỗi deploy):**

> Fix lỗi build/deploy trên Vercel cho ứng dụng Next.js Expense Tracker. Đảm bảo compatible với Vercel Edge Runtime nếu cần.

---

## Phần 6: Viết Document & Screenshots

### Bước 6.1: Tạo README.md

**Prompt:**

> Tạo README.md cho project Expense Tracker bao gồm: mô tả project, tech stack, screenshots placeholders, hướng dẫn cài đặt local, hướng dẫn deploy, cấu trúc thư mục, link demo live.

### Bước 6.2: Chụp Screenshots

Chụp các màn hình sau và lưu vào thư mục `docs/screenshots/`:

1. **Dashboard** - Trang tổng quan với biểu đồ
2. **Transactions List** - Danh sách giao dịch với filter
3. **Add Transaction** - Form thêm giao dịch mới
4. **Categories** - Trang quản lý danh mục
5. **Export CSV** - Kết quả file CSV đã export
6. **Mobile View** - Giao diện trên mobile (responsive)

---

## Phần 7: Submit bài

### Checklist trước khi submit

- [ ] Code chạy không lỗi trên local (`pnpm dev`)
- [ ] Đã deploy thành công lên Vercel
- [ ] README.md đầy đủ thông tin
- [ ] Có screenshots minh hoạ
- [ ] Sử dụng SpecKit (có thư mục `specs/`)
- [ ] Sử dụng ít nhất 1 MCP Server (Context7)
- [ ] Code push lên GitHub public repo
- [ ] Repo có commit history rõ ràng

### Submit

1. Đảm bảo repo ở chế độ **public**
2. Copy link repo: `https://github.com/YOUR_USERNAME/expense-tracker`
3. Submit link vào form bài tập

---

## Tips để Leader Review OK

1. **Commit history sạch**: Chia commits theo feature, message rõ ràng (ví dụ: `feat: add dashboard with charts`, `feat: add transaction CRUD`)
2. **Code quality**: Không có `any` type, không có console.log thừa, code format đẹp
3. **Responsive**: App hoạt động tốt trên cả desktop và mobile
4. **Spec rõ ràng**: File spec trong `specs/` phải chi tiết, thể hiện rõ flow SDD
5. **Document đầy đủ**: README có hướng dẫn setup, screenshots, link demo
6. **MCP usage**: Ghi chú trong README về việc sử dụng MCP Server nào và mục đích

---

## Tổng hợp Prompt Flow

| Bước | Mục đích | Prompt tóm tắt |
|------|----------|-----------------|
| 1 | Init project | "Khởi tạo Next.js + TypeScript + Tailwind" |
| 2 | Database | "Tạo SQL migration cho categories & transactions" |
| 3 | Types & Client | "Tạo Supabase client và TypeScript types" |
| 4 | Dashboard | "Tạo trang dashboard với summary cards và charts" |
| 5 | Transactions | "Tạo trang CRUD transactions với filter/search" |
| 6 | Categories | "Tạo trang quản lý categories" |
| 7 | Export CSV | "Thêm tính năng export CSV" |
| 8 | Layout | "Tạo sidebar navigation responsive" |
| 9 | Polish | "Format VND, fix bugs, test responsive" |
| 10 | Deploy | "Deploy lên Vercel" |
| 11 | Docs | "Tạo README và chụp screenshots" |
