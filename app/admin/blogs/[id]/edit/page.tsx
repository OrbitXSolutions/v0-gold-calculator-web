"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getBlogById } from "../../../../../lib/api"
import { BlogForm } from "../../../../../components/admin/BlogForm"
import type { BlogDto } from "../../../../../types/blog"
import { ArrowLeft } from "lucide-react"

export default function AdminBlogEditPage() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const id = params.id

  const [blog, setBlog] = useState<BlogDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true)
        setError(null)
        const data = await getBlogById(id)
        setBlog(data)
      } catch (err) {
        console.error("[v0] Error fetching blog:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch blog")
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id])

  if (loading) {
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
          <h1 className="text-2xl font-semibold text-gray-900">Edit Blog</h1>
        </div>
        <div className="admin-card p-8 text-center text-gray-500">Loading blog...</div>
      </div>
    )
  }

  if (error || !blog) {
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
          <h1 className="text-2xl font-semibold text-gray-900">Edit Blog</h1>
        </div>
        <div className="admin-card p-8 text-center">
          <p className="text-red-600 mb-4">Error: {error || "Blog not found"}</p>
          <button
            onClick={() => (window.location.href = "/admin/blogs")}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    )
  }

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
        <h1 className="text-2xl font-semibold text-gray-900">Edit Blog</h1>
      </div>
      <BlogForm
        mode="edit"
        blog={blog}
        onSaved={() => {
          /* Blog updated */
        }}
      />
    </div>
  )
}
