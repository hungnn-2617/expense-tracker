import { getCategories } from "@/app/lib/services/category"
import { CategoriesPageClient } from "./CategoriesPageClient"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return <CategoriesPageClient categories={categories} />
}
