"use client"
import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, FileText, FolderOpen, LogOut } from "lucide-react"

const links = [
  { href: "/admin", label: "Dashboard", icon: BarChart3, exact: true },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  // { href: "/admin/comments", label: "Comments", icon: MessageSquare },
]

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [displayName, setDisplayName] = React.useState<string>("")

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user")
      if (raw) {
        const parsed = JSON.parse(raw)
        setDisplayName(parsed.displayName || parsed.userName || "")
      }
    } catch {}
  }, [])

  function logout() {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    router.replace("/admin/login")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm text-gray-600">Welcome back{displayName ? "," : ""}</p>
        {displayName && <p className="text-sm font-medium text-gray-900 mt-0.5">{displayName}</p>}
      </div>

      <nav className="flex flex-col gap-1 p-4 flex-1">
        {links.map((l) => {
          const Icon = l.icon
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href)
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {l.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
