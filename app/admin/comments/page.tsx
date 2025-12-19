"use client"
import React from "react"
import { listComments, formatDate, deleteComment, updateComment } from "../../../lib/api"
import type { CommentDto } from "../../../types/blog"
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Edit2,
  Trash2,
  Save,
  X,
  User,
  Mail,
  Calendar,
  AlertCircle,
  MessageSquare,
} from "lucide-react"

export default function AdminCommentsPage() {
  const [blogId, setBlogId] = React.useState("")
  const [comments, setComments] = React.useState<CommentDto[]>([])
  const [page, setPage] = React.useState(1)
  const [pageSize] = React.useState(20)
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editContent, setEditContent] = React.useState("")

  async function load(resetPage = false) {
    setLoading(true)
    setError(null)
    try {
      const targetPage = resetPage ? 1 : page
      const paged = await listComments({ page: targetPage, pageSize, blogId: blogId || undefined })
      setComments(paged.items)
      setTotalCount(paged.totalCount)
      if (resetPage) setPage(1)
    } catch (err: any) {
      setError(err.message || "Failed to load comments")
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: string, hard: boolean) {
    try {
      await deleteComment(id, hard)
      setComments((c) => c.filter((x) => x.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  function startEdit(c: CommentDto) {
    setEditingId(c.id)
    setEditContent(c.content)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditContent("")
  }

  async function saveEdit() {
    if (!editingId) return
    try {
      const updated = await updateComment(editingId, editContent)
      setComments((list) => list.map((c) => (c.id === updated.id ? updated : c)))
      cancelEdit()
    } catch (err: any) {
      alert(err.message || "Failed to update comment")
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const canPrev = page > 1
  const canNext = page < totalPages

  function go(delta: number) {
    setPage((p) => Math.max(1, Math.min(totalPages, p + delta)))
  }

  React.useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // initial load
  React.useEffect(() => {
    load(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Comments Moderation</h1>
        <p className="text-sm text-gray-600">Manage and moderate user comments</p>
      </div>

      <div className="admin-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col flex-1">
            <label className="text-sm font-medium mb-2 text-gray-700">Filter by Blog ID</label>
            <input
              value={blogId}
              onChange={(e) => setBlogId(e.target.value)}
              placeholder="Optional Blog GUID"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          <button
            onClick={() => load(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 transition-colors sm:self-end h-10"
          >
            <Filter className="w-4 h-4" />
            Apply Filter
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-sm text-gray-600">
          Showing page {page} of {totalPages} ({totalCount} total comments)
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={!canPrev}
            onClick={() => go(-1)}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors disabled:hover:bg-white disabled:hover:text-gray-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={!canNext}
            onClick={() => go(1)}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors disabled:hover:bg-white disabled:hover:text-gray-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-card p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="admin-card p-8 text-center">
          <p className="text-sm text-gray-500">Loading comments...</p>
        </div>
      )}

      {!loading && comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="admin-card p-5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-4">
                {/* Header with author info */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{c.authorDisplayName}</span>
                      {c.isDeleted && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-600">Deleted</span>
                      )}
                      {!c.isDeleted && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">Active</span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{String((c as any)?.authorEmail || "N/A")}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(c.createdUtc)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment content */}
                <div className="pl-0">
                  {editingId === c.id ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 min-h-32 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 rounded-lg p-3">{c.content}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  {editingId === c.id ? (
                    <>
                      <button
                        onClick={saveEdit}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-medium transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(c)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 text-xs font-medium transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => remove(c.id, false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Soft Delete
                      </button>
                      <button
                        onClick={() => remove(c.id, true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 text-xs font-medium transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hard Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && comments.length === 0 && (
        <div className="admin-card p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No comments found.</p>
        </div>
      )}
    </div>
  )
}
