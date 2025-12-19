"use client"
import React from "react"
import { getBlogs } from "../../lib/api"
import { BlogCard } from "../../components/blog/BlogCard"
import { SearchBar } from "../../components/blog/SearchBar"
import { Pagination } from "../../components/blog/Pagination"
import type { BlogListQuery } from "../../types/blog"
import { useLanguage } from "@/lib/language-context"
import { getBlogTranslation } from "@/lib/translations"
import { BookOpen } from "lucide-react"

interface BlogPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

function parseQuery(sp: BlogPageProps["searchParams"]): BlogListQuery {
  const pageRaw = sp.page
  const pageSizeRaw = sp.pageSize
  const search = typeof sp.search === "string" ? sp.search : undefined
  const page = pageRaw ? Number.parseInt(String(pageRaw), 10) || 1 : 1
  const pageSize = pageSizeRaw ? Number.parseInt(String(pageSizeRaw), 10) || 9 : 9
  return { page, pageSize, search, publishedOnly: true }
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const { language } = useLanguage()
  const t = getBlogTranslation(language)
  const [blogs, setBlogs] = React.useState<any>(null)
  const query = parseQuery(searchParams)

  React.useEffect(() => {
    getBlogs(query).then(setBlogs)
  }, [JSON.stringify(query)])

  if (!blogs) return <div className="px-4 py-10">Loading...</div>

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t.pageTitle}</h1>
            <p className="text-sm text-gray-600 max-w-2xl">{t.pageDescription}</p>
          </div>
        </div>
        <SearchBar language={language} />
      </div>

      {query.search && (
        <p className="text-sm text-gray-500 mb-4">
          {t.showingResults} <span className="font-medium">"{query.search}"</span>
        </p>
      )}

      {blogs.items.length === 0 && (
        <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500">
          {t.noArticles}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.items.map((b: any) => (
          <BlogCard key={b.id} blog={b} language={language} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Pagination page={blogs.page} totalPages={blogs.totalPages ?? 1} language={language} />
      </div>
    </div>
  )
}
