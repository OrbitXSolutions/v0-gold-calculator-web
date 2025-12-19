import type React from "react"
import { getBlogs, getCategories, listComments } from "../../lib/api"
import { BarChart3, FileText, FolderOpen, MessageSquare, TrendingUp, Users } from "lucide-react"

export const revalidate = 30

async function getStats() {
  try {
    const [blogs, categories, comments] = await Promise.all([
      getBlogs({ page: 1, pageSize: 100, publishedOnly: false }),
      getCategories(),
      listComments({ page: 1, pageSize: 100 }),
    ])

    const publishedBlogs = blogs.items.filter((b) => b.isPublished).length
    const draftBlogs = blogs.items.filter((b) => !b.isPublished).length

    return {
      totalBlogs: blogs.totalCount,
      publishedBlogs,
      draftBlogs,
      totalCategories: categories.length,
      totalComments: comments.totalCount,
      recentBlogs: blogs.items.slice(0, 5),
    }
  } catch {
    return {
      totalBlogs: 0,
      publishedBlogs: 0,
      draftBlogs: 0,
      totalCategories: 0,
      totalComments: 0,
      recentBlogs: [],
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back to your content management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          label="Total Blogs"
          value={stats.totalBlogs}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5" />}
          label="Published"
          value={stats.publishedBlogs}
          sublabel={`${stats.draftBlogs} drafts`}
        />
        <StatCard
          icon={<MessageSquare className="w-5 h-5" />}
          label="Comments"
          value={stats.totalComments}
          trend="+8%"
          trendUp={true}
        />
        <StatCard icon={<FolderOpen className="w-5 h-5" />} label="Categories" value={stats.totalCategories} />
        <StatCard icon={<Users className="w-5 h-5" />} label="Active Users" value={1} sublabel="Admin" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Blogs</h2>
            <a href="/admin/blogs" className="text-sm text-amber-600 hover:text-amber-700">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {stats.recentBlogs.length > 0 ? (
              stats.recentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-500 mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{blog.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {blog.isPublished ? "Published" : "Draft"} • {new Date(blog.createdUtc).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      blog.isPublished ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                    }`}
                  >
                    {blog.isPublished ? "Live" : "Draft"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-4">No blogs yet. Create your first one!</p>
            )}
          </div>
        </div>

        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard href="/admin/blogs/create" label="New Blog" icon={<FileText className="w-5 h-5" />} />
            <QuickActionCard href="/admin/categories" label="Categories" icon={<FolderOpen className="w-5 h-5" />} />
            <QuickActionCard href="/admin/comments" label="Comments" icon={<MessageSquare className="w-5 h-5" />} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
  trend,
  trendUp,
}: {
  icon: React.ReactNode
  label: string
  value: number
  sublabel?: string
  trend?: string
  trendUp?: boolean
}) {
  return (
    <div className="admin-card admin-stat-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-amber-50 text-amber-600">{icon}</div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trendUp ? "text-green-600" : "text-red-600"}`}>
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{label}</p>
        {sublabel && <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  )
}

function QuickActionCard({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
    >
      <div className="text-gray-600 group-hover:text-amber-600 transition-colors">{icon}</div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
    </a>
  )
}
