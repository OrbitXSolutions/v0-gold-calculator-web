"use client"
import { useRouter } from "next/navigation"
import { BlogForm } from "../../../../components/admin/BlogForm"
import type { BlogDto } from "../../../../types/blog"
import { ArrowLeft } from "lucide-react"

export default function AdminBlogCreatePage() {
  const router = useRouter()
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/admin/blogs")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
        >
          <ArrowLeft size={18} />
          Back to List
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Create Blog</h1>
      </div>
      <BlogForm
        mode="create"
        onSaved={(b: BlogDto) => {
          try {
            router.push(`/admin/blogs/${b.id}/edit`)
          } catch (err) {
            console.error("Navigation error:", err)
            // Fallback to blogs list if edit page fails
            router.push("/admin/blogs")
          }
        }}
      />
    </div>
  )
}
