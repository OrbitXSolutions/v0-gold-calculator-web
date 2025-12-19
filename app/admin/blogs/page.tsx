"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getBlogs, formatDate, deleteBlog } from "../../../lib/api"
import type { BlogDto } from "../../../types/blog"
import { Plus, Trash2, RefreshCw } from "lucide-react"
import { useToast } from "../../../hooks/use-toast"

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const paged = await getBlogs({ page: 1, pageSize: 20, publishedOnly: false })
      setBlogs(paged.items)
    } catch (err) {
      console.error("[v0] Error in fetchBlogs:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch blogs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const paged = await getBlogs({ page: 1, pageSize: 20, publishedOnly: false })
      setBlogs(paged.items)
      toast({
        title: "Refreshed",
        description: "Blog list has been refreshed",
        variant: "default",
      })
    } catch (err) {
      console.error("[v0] Error refreshing blogs:", err)
      toast({
        title: "Error",
        description: "Failed to refresh blogs",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return

    try {
      setDeleting(true)
      await deleteBlog(deleteConfirm.id)
      toast({
        title: "Success!",
        description: "Blog deleted successfully",
        variant: "default",
      })
      setBlogs(blogs.filter((b) => b.id !== deleteConfirm.id))
      setDeleteConfirm(null)
    } catch (err) {
      console.error("[v0] Error deleting blog:", err)
      toast({
        title: "Error",
        description: "Failed to delete blog: " + (err instanceof Error ? err.message : "Unknown error"),
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Blog</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your blog posts and content</p>
          </div>
        </header>
        <div className="admin-card p-8 text-center text-gray-500">Loading blogs...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Blog</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your blog posts and content</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/admin/blogs/create"
              className="flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Blog
            </Link>
          </div>
        </header>
        <div className="admin-card p-8 text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Blog</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your blog posts and content</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/admin/blogs/create"
              className="flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Blog
            </Link>
          </div>
        </header>

        <div className="admin-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left">
                <th className="p-4 text-gray-600 font-medium">Title</th>
                <th className="p-4 text-gray-600 font-medium">Status</th>
                <th className="p-4 text-gray-600 font-medium">Created</th>
                <th className="p-4 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-900 font-medium">{b.title}</td>
                  <td className="p-4">
                    {b.isPublished ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-600">{formatDate(b.createdUtc)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/blogs/${b.id}/edit`}
                        className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 text-xs font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm({ id: b.id, title: b.title })}
                        className="px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No blogs found. Create your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Delete Blog</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "<span className="font-medium">{deleteConfirm.title}</span>"? This action
              cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
