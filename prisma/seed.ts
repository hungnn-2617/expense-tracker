import { PrismaClient, TransactionType } from "@prisma/client"

const prisma = new PrismaClient()

const defaultCategories = [
  // Expense categories
  { name: "Ăn uống", type: TransactionType.EXPENSE, icon: "🍜", color: "#FF6B6B", isDefault: true },
  { name: "Di chuyển", type: TransactionType.EXPENSE, icon: "🚗", color: "#4ECDC4", isDefault: true },
  { name: "Mua sắm", type: TransactionType.EXPENSE, icon: "🛍️", color: "#45B7D1", isDefault: true },
  { name: "Giải trí", type: TransactionType.EXPENSE, icon: "🎮", color: "#96CEB4", isDefault: true },
  { name: "Hóa đơn", type: TransactionType.EXPENSE, icon: "📄", color: "#FFEAA7", isDefault: true },
  { name: "Sức khỏe", type: TransactionType.EXPENSE, icon: "💊", color: "#DDA0DD", isDefault: true },
  { name: "Giáo dục", type: TransactionType.EXPENSE, icon: "📚", color: "#98D8C8", isDefault: true },
  { name: "Khác (chi)", type: TransactionType.EXPENSE, icon: "📦", color: "#AEB6BF", isDefault: true },
  // Income categories
  { name: "Lương", type: TransactionType.INCOME, icon: "💰", color: "#2ECC71", isDefault: true },
  { name: "Freelance", type: TransactionType.INCOME, icon: "💻", color: "#3498DB", isDefault: true },
  { name: "Đầu tư", type: TransactionType.INCOME, icon: "📈", color: "#E74C3C", isDefault: true },
  { name: "Khác (thu)", type: TransactionType.INCOME, icon: "🎁", color: "#F39C12", isDefault: true },
]

async function main() {
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        name_type: { name: category.name, type: category.type },
      },
      update: {},
      create: category,
    })
  }
  console.log("Seeded 12 default categories")
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
