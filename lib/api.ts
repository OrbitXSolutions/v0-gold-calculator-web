import {
  type BlogCreateDto,
  type BlogDto,
  type BlogListQuery,
  type BlogUpdateDto,
  type CategoryDto,
  type CommentDto,
  type CommentListQuery,
  type PagedResult,
  type StandardErrorResponse,
  type TagDto,
  enhancePagedResult,
} from "../types/blog"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.goldchecker.ae/api" // Removed /Admin from base URL

// Internal: build URL with query params
function buildUrl(path: string, params?: Record<string, any>): string {
  // ensure we don't end up with double slashes
  const normalized = path.replace(/^\//, "")
  const url = new URL(normalized, BASE_URL.endsWith("/") ? BASE_URL : BASE_URL + "/")
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return
      url.searchParams.append(k, String(v))
    })
  }
  return url.toString()
}

// Placeholder auth token retrieval. Adjust to real auth mechanism.
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

function authHeaders(): HeadersInit {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    if (res.status === 204) return undefined as unknown as T // No Content
    return res.json() as Promise<T>
  }
  let errorBody: StandardErrorResponse | undefined
  try {
    errorBody = await res.json()
  } catch {
    /* swallow */
  }
  const message = errorBody?.error?.message || `Request failed (${res.status})`
  const err = new Error(message) as Error & { details?: any; status?: number; code?: string }
  err.status = res.status
  err.code = errorBody?.error?.code
  err.details = errorBody?.error?.details
  throw err
}

// --- Blog endpoints ---
export async function getBlogs(query: BlogListQuery = {}): Promise<PagedResult<BlogDto>> {
  try {
    const queryParams = {
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
      publishedOnly: query.publishedOnly ?? false,
      ...query,
    }

    const url = buildUrl("Blogs", queryParams)

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...authHeaders(),
      },
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Blogs fetch failed:", res.status, errorText)
      throw new Error(`Failed to fetch blogs: ${res.status}`)
    }

    const data = await handleResponse<PagedResult<BlogDto>>(res)
    return enhancePagedResult(data)
  } catch (err) {
    console.error("Error fetching blogs:", err)
    return enhancePagedResult({
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
      totalCount: 0,
      items: [],
    })
  }
}

export async function getBlogById(id: string): Promise<BlogDto> {
  try {
    const url = buildUrl(`Blogs/${id}`)

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...authHeaders(),
      },
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Error fetching blog:", errorText)
      throw new Error(`Failed to fetch blog: ${res.status}`)
    }

    return handleResponse<BlogDto>(res)
  } catch (err) {
    console.error("Error fetching blog by ID:", err)
    throw err
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogDto> {
  try {
    const url = buildUrl(`Blogs/slug/${slug}`)

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...authHeaders(),
      },
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Error fetching blog by slug:", errorText)
      throw new Error(`Failed to fetch blog: ${res.status}`)
    }

    const result = await handleResponse<BlogDto>(res)
    return result
  } catch (err) {
    console.error("Error fetching blog by slug:", err)
    throw err
  }
}

export async function createBlog(input: BlogCreateDto): Promise<BlogDto> {
  try {
    const url = buildUrl("Blogs")

    const res = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(input),
    })

    if (!res.ok && res.status !== 201) {
      const errorText = await res.text()
      console.error("Error creating blog:", errorText)
      throw new Error(`Failed to create blog: ${res.status}`)
    }

    const result = await handleResponse<BlogDto>(res)
    return result
  } catch (err) {
    console.error("Error creating blog:", err)
    throw err
  }
}

export async function updateBlog(id: string, input: BlogUpdateDto): Promise<BlogDto> {
  const url = buildUrl(`Blogs/${id}`)
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  })
  return handleResponse<BlogDto>(res)
}

export async function publishBlog(id: string): Promise<BlogDto> {
  // Fetch the blog first to get its current data
  const currentBlog = await getBlogById(id)

  // Update with isPublished set to true
  const updateDto: BlogUpdateDto = {
    title: currentBlog.title,
    summary: currentBlog.summary || null,
    content: currentBlog.content,
    tags: currentBlog.tags,
    categories: currentBlog.categories,
    publish: true,
    unpublish: false,
  }

  return updateBlog(id, updateDto)
}

export async function unpublishBlog(id: string): Promise<BlogDto> {
  // Fetch the blog first to get its current data
  const currentBlog = await getBlogById(id)

  // Update with isPublished set to false
  const updateDto: BlogUpdateDto = {
    title: currentBlog.title,
    summary: currentBlog.summary || null,
    content: currentBlog.content,
    tags: currentBlog.tags,
    categories: currentBlog.categories,
    publish: false,
    unpublish: true,
  }

  return updateBlog(id, updateDto)
}

export async function deleteBlog(id: string): Promise<void> {
  const url = buildUrl(`Blogs/${id}`)
  const res = await fetch(url, {
    method: "DELETE",
    headers: authHeaders(),
  })
  await handleResponse<void>(res)
}

// --- Comments ---
export async function getComments(blogId: string, query: CommentListQuery = {}): Promise<PagedResult<CommentDto>> {
  const url = buildUrl(`blogs/${blogId}/comments`, query)
  const res = await fetch(url, { next: { revalidate: 30 } })
  const data = await handleResponse<PagedResult<CommentDto>>(res)
  return enhancePagedResult(data)
}

export async function postComment(blogId: string, content: string): Promise<CommentDto> {
  const url = buildUrl(`blogs/${blogId}/comments`)
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ content }),
  })
  return handleResponse<CommentDto>(res)
}

export async function deleteComment(commentId: string, hard = false): Promise<void> {
  const url = buildUrl(`comments/${commentId}`, hard ? { hard: true } : undefined)
  const res = await fetch(url, { method: "DELETE", headers: authHeaders() })
  await handleResponse<void>(res)
}

// List all comments (optionally filtered by blogId) paginated
export async function listComments(
  query: { page?: number; pageSize?: number; blogId?: string } = {},
): Promise<PagedResult<CommentDto>> {
  const params: Record<string, any> = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
  }
  if (query.blogId) params.blogId = query.blogId
  const url = buildUrl("comments", params)
  try {
    const res = await fetch(url, { headers: { ...authHeaders() }, next: { revalidate: 10 } })
    const data = await handleResponse<PagedResult<CommentDto>>(res)
    // Normalize/enhance if backend supplies basic shape
    if ((data as any).items && Array.isArray((data as any).items)) {
      return enhancePagedResult(data)
    }
    // Fallback: assume array of comments returned
    if (Array.isArray(data)) {
      const arr = data as unknown as CommentDto[]
      return enhancePagedResult({ page: params.page, pageSize: params.pageSize, totalCount: arr.length, items: arr })
    }
    return enhancePagedResult({ page: params.page, pageSize: params.pageSize, totalCount: 0, items: [] })
  } catch {
    return enhancePagedResult({ page: params.page, pageSize: params.pageSize, totalCount: 0, items: [] })
  }
}

// Update comment content (generic moderation/edit)
export async function updateComment(commentId: string, content: string): Promise<CommentDto> {
  const url = buildUrl(`comments/${commentId}`)
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ content }),
  })
  return handleResponse<CommentDto>(res)
}

// --- Categories ---
export async function getCategories(): Promise<CategoryDto[]> {
  // Try lowercase then PascalCase to handle backend casing differences.
  const variants = ["categories", "Categories"]
  for (const v of variants) {
    try {
      const url = buildUrl(v)
      const res = await fetch(url, {
        next: { revalidate: 120 },
        headers: { ...authHeaders() },
      })
      if (!res.ok) continue // try next variant
      return await handleResponse<CategoryDto[]>(res)
    } catch (err) {
      // continue to next variant
    }
  }
  return []
}

export async function createCategory(name: string, parentCategoryId?: string | null): Promise<CategoryDto> {
  const url = buildUrl("categories")
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name, parentCategoryId: parentCategoryId ?? null }),
  })
  return handleResponse<CategoryDto>(res)
}

export async function updateCategory(id: string, name: string, parentCategoryId?: string | null): Promise<CategoryDto> {
  const url = buildUrl(`categories/${id}`)
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name, parentCategoryId: parentCategoryId ?? null }),
  })
  return handleResponse<CategoryDto>(res)
}

export async function deleteCategory(id: string): Promise<void> {
  const url = buildUrl(`categories/${id}`)
  const res = await fetch(url, { method: "DELETE", headers: authHeaders() })
  await handleResponse<void>(res)
}

// --- Tags ---
export async function getTags(): Promise<TagDto[]> {
  const url = buildUrl("tags")
  const res = await fetch(url, { next: { revalidate: 600 } })
  return handleResponse<TagDto[]>(res)
}

export async function createTag(name: string): Promise<TagDto> {
  const url = buildUrl("tags")
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name }),
  })
  return handleResponse<TagDto>(res)
}

export async function updateTag(id: string, name: string): Promise<TagDto> {
  const url = buildUrl(`tags/${id}`)
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name }),
  })
  return handleResponse<TagDto>(res)
}

export async function deleteTag(id: string): Promise<void> {
  const url = buildUrl(`tags/${id}`)
  const res = await fetch(url, { method: "DELETE", headers: authHeaders() })
  await handleResponse<void>(res)
}

// --- Media ---
export interface MediaDto {
  id: string
  fileName: string
  contentType: string
  sizeBytes: number
  url: string
  uploadedUtc?: string
}

// Upload a single file (multipart/form-data)
export async function uploadMedia(file: File): Promise<MediaDto> {
  try {
    const url = buildUrl("Media")

    const form = new FormData()
    form.append("file", file)

    const res = await fetch(url, {
      method: "POST",
      headers: { ...authHeaders() },
      body: form,
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Media upload error:", errorText)
      throw new Error(`Media upload failed: ${res.status} - ${errorText}`)
    }

    const result = await handleResponse<MediaDto>(res)
    return result
  } catch (err) {
    console.error("Media upload exception:", err)
    throw err
  }
}

export async function getMedia(id: string): Promise<MediaDto> {
  const url = buildUrl(`Media/${id}`)
  const res = await fetch(url, { headers: { ...authHeaders() }, next: { revalidate: 300 } })
  return handleResponse<MediaDto>(res)
}

export async function deleteMedia(id: string): Promise<void> {
  const url = buildUrl(`Media/${id}`)
  const res = await fetch(url, { method: "DELETE", headers: { ...authHeaders() } })
  await handleResponse<void>(res)
}

// --- Optional advanced endpoint ---
export async function regenerateSlug(id: string, strategy: "fromTitle" = "fromTitle"): Promise<BlogDto> {
  const url = buildUrl(`blogs/${id}/regenerate-slug`)
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ strategy }),
  })
  return handleResponse<BlogDto>(res)
}

// Utility: estimate read time (to move to separate file later if desired)
export function estimateReadMinutes(content: string, wordsPerMinute = 220): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export function formatDate(iso: string | null | undefined, locale = "en-US"): string {
  if (!iso) return ""
  try {
    return new Date(iso).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })
  } catch {
    return iso
  }
}

// --- Auth ---
export interface LoginResponse {
  userId: string
  userName: string
  displayName: string
  accessToken: string
  refreshToken?: string
  expiresUtc?: string
}

const AUTH_LOGIN_PATH = process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH || "Auth/login" // Updated auth path to use PascalCase Auth

export async function loginWithPassword(identifier: string, password: string): Promise<LoginResponse> {
  const url = buildUrl(AUTH_LOGIN_PATH)
  const body = { userNameOrEmail: identifier, password }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  return handleResponse<LoginResponse>(res)
}
