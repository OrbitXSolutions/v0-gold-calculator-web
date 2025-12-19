"use client"
import clsx from "clsx"
import { useRouter, useSearchParams } from "next/navigation"
import { getBlogTranslation, type Language } from "@/lib/translations"

interface PaginationProps {
  page: number
  totalPages: number
  className?: string
  language: Language
}

export function Pagination({ page, totalPages, className, language }: PaginationProps) {
  const t = getBlogTranslation(language)
  const router = useRouter()
  const params = useSearchParams()

  function setPage(p: number) {
    const sp = new URLSearchParams(params.toString())
    sp.set("page", String(p))
    router.push(`?${sp.toString()}`)
  }

  if (totalPages <= 1) return null

  const maxButtons = 5
  const start = Math.max(1, page - Math.floor(maxButtons / 2))
  const end = Math.min(totalPages, start + maxButtons - 1)
  const pages: number[] = []
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <nav className={clsx("flex items-center gap-2", className)} aria-label="Pagination">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded border text-sm disabled:opacity-40 bg-white hover:bg-gray-50"
      >
        {t.prevButton}
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={clsx(
            "px-3 py-1 rounded border text-sm bg-white hover:bg-gray-50",
            p === page && "!bg-yellow-400 text-white border-yellow-400 hover:bg-yellow-500",
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded border text-sm disabled:opacity-40 bg-white hover:bg-gray-50"
      >
        {t.nextButton}
      </button>
    </nav>
  )
}
