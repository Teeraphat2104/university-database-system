import { CreateCategoryForm } from "./create-form"

export default function CreateCategoryPage() {
  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Add Category</h1>
      <CreateCategoryForm />
    </div>
  )
}
