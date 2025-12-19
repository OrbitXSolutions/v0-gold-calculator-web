"use client"
import React from "react"
import { useRouter } from "next/navigation"
import { AdminNav } from "./AdminNav"
import { Menu, X } from "lucide-react"

interface AdminShellProps {
  children: React.ReactNode
}

function useAuthGuard() {
  const router = useRouter()
  React.useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    if (!token) router.replace("/admin/login")
  }, [router])
}

export function AdminShell({ children }: AdminShellProps) {
  useAuthGuard()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <div className="admin-light admin-panel min-h-screen flex">
      <aside className="hidden lg:flex w-64 border-r border-gray-200 bg-white flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">GoldCheck</h2>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AdminNav />
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 border-r border-gray-200 bg-white flex flex-col z-50 transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">GoldCheck</h2>
            <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AdminNav onNavigate={() => setMobileMenuOpen(false)} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-gray-50">
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <Menu className="w-6 h-6" />
            <span className="text-sm font-medium">Menu</span>
          </button>
        </div>

        <div className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
