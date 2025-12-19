"use client"
import React from "react"
import { useRouter } from "next/navigation"
import { RichMarkdownEditor } from "./RichMarkdownEditor"
import type { BlogCreateDto, BlogDto, BlogUpdateDto } from "../../types/blog"
import { createBlog, updateBlog, publishBlog, unpublishBlog } from "../../lib/api"
import { Save, Eye, EyeOff } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface BlogFormProps {
  mode: "create" | "edit"
  blog?: BlogDto
  onSaved?: (b: BlogDto) => void
}

export function BlogForm({ mode, blog, onSaved }: BlogFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = React.useState(blog?.title || "")
  const [summary, setSummary] = React.useState(blog?.summary || "")
  const [content, setContent] = React.useState(blog?.content || "")
  const [tags, setTags] = React.useState(blog?.tags.join(", ") || "")
  const [categories, setCategories] = React.useState(blog?.categories.join(", ") || "")
  const [publish, setPublish] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      if (mode === "create") {
        const dto: BlogCreateDto = {
          title,
          summary: summary || null,
          content,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          categories: categories
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
          publish,
        }
        const created = await createBlog(dto)
        setMessage({ type: "success", text: "Blog created successfully!" })
        window.scrollTo({ top: 0, behavior: "smooth" })
        setTimeout(() => router.push("/admin/blogs"), 2000)
      } else if (blog) {
        const dto: BlogUpdateDto = {
          title,
          summary: summary || null,
          content,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          categories: categories
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
          publish: false,
          unpublish: false,
        }
        const updated = await updateBlog(blog.id, dto)
        setMessage({ type: "success", text: "Blog updated successfully! Your changes have been saved." })
        window.scrollTo({ top: 0, behavior: "smooth" })
        onSaved?.(updated)
        setTimeout(() => setMessage(null), 5000)
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save blog. Please try again." })
      window.scrollTo({ top: 0, behavior: "smooth" })
      console.error("Error saving blog:", err)
    } finally {
      setLoading(false)
    }
  }

  async function doPublish(next: boolean) {
    if (!blog) return
    setLoading(true)
    setMessage(null)
    try {
      const updated = next ? await publishBlog(blog.id) : await unpublishBlog(blog.id)
      setMessage({ type: "success", text: next ? "Blog published successfully!" : "Blog unpublished successfully!" })
      window.scrollTo({ top: 0, behavior: "smooth" })
      setTimeout(() => router.push("/admin/blogs"), 2000)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to toggle publish" })
      window.scrollTo({ top: 0, behavior: "smooth" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      {message && (
        <div
          className={`rounded-lg px-6 py-4 font-semibold text-white shadow-lg animate-in slide-in-from-top-2 duration-300 ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter blog title..."
          className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder:text-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Summary</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          placeholder="Brief summary of the blog post..."
          className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder:text-gray-400 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-3 text-gray-700">Content</label>
        <RichMarkdownEditor value={content} onChange={setContent} />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Tags</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="gold, calculator, finance"
            className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder:text-gray-400"
          />
          <p className="mt-1 text-xs text-gray-500">Comma separated</p>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Categories</label>
          <input
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="news, guides, updates"
            className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder:text-gray-400"
          />
          <p className="mt-1 text-xs text-gray-500">Comma separated</p>
        </div>
      </div>

      {mode === "create" && (
        <label className="flex items-center gap-3 text-sm cursor-pointer w-fit px-4 py-3 rounded-lg bg-white border border-gray-300 hover:border-gray-400 transition-all">
          <input
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-0 bg-white"
          />
          <span className="text-gray-700 font-medium">Publish immediately</span>
        </label>
      )}

      <div className="flex items-center gap-3 flex-wrap pt-4 border-t border-gray-200">
        <button
          disabled={loading}
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 text-sm font-semibold transition-all shadow-lg shadow-amber-600/20"
        >
          <Save size={18} />
          {loading ? "Saving..." : mode === "create" ? "Create Blog" : "Save Changes"}
        </button>
        {mode === "edit" && blog && (
          <>
            {blog.isPublished ? (
              <button
                type="button"
                disabled={loading}
                onClick={() => doPublish(false)}
                className="flex items-center gap-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-3 font-medium transition-all disabled:opacity-40"
              >
                <EyeOff size={18} />
                Unpublish
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={() => doPublish(true)}
                className="flex items-center gap-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 px-5 py-3 font-medium transition-all disabled:opacity-40 shadow-lg shadow-green-600/20"
              >
                <Eye size={18} />
                Publish
              </button>
            )}
          </>
        )}
      </div>
    </form>
  )
}
