"use client"
import React from "react"
import { getCategories, deleteCategory } from "../../../lib/api"
import { CategoryForm } from "../../../components/admin/CategoryForm"
import type { CategoryDto } from "../../../types/blog"
import { RefreshCw } from "lucide-react"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<CategoryDto[]>([])
  const [editing, setEditing] = React.useState<CategoryDto | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [lastFetchedAt, setLastFetchedAt] = React.useState<Date | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      console.log("[v0] Fetching categories from API...")
      const data = await getCategories()
      console.log("[v0] Categories fetched:", data)
      setCategories(data)
      setLastFetchedAt(new Date())
    } catch (err: any) {
      console.error("[v0] Error fetching categories:", err)
      setError(err.message || "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    load()
  }, [])

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-center justify-between bg-white border border-gray-200 p-6 rounded-lg">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Categories</h1>
          <p className="text-sm text-gray-600">Manage content taxonomies and organization</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-sm font-medium px-4 py-2.5 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="admin-card p-6 max-w-md bg-white rounded-lg">
        <CategoryForm
          category={editing}
          onSaved={(c) => {
            setEditing(null)
            setCategories((prev) => {
              const exists = prev.some((p) => p.id === c.id)
              if (exists) return prev.map((p) => (p.id === c.id ? c : p))
              return [c, ...prev]
            })
          }}
          onCancelEdit={() => setEditing(null)}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="admin-card overflow-hidden bg-white rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left">
              <th className="p-4 text-gray-600 font-medium">Name</th>
              <th className="p-4 text-gray-600 font-medium">Slug</th>
              <th className="p-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!loading &&
              categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-900 font-medium">{c.name}</td>
                  <td className="p-4 text-gray-600 text-xs">{c.slug}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing(c)}
                        className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm(`Delete category "${c.name}"?`)) return
                          try {
                            await deleteCategory(c.id)
                            setCategories((prev) => prev.filter((p) => p.id !== c.id))
                            if (editing?.id === c.id) setEditing(null)
                          } catch (err: any) {
                            alert(err.message || "Delete failed")
                          }
                        }}
                        className="px-3 py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-600 hover:text-red-700 text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No categories yet. Create your first one above.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {lastFetchedAt && <p className="text-xs text-gray-600">Last updated: {lastFetchedAt.toLocaleTimeString()}</p>}
    </div>
  )
}
