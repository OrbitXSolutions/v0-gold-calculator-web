// TypeScript DTO and helper types for Blog feature
// Public API data contracts mirroring backend C# DTOs

export interface PagedResult<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
  // Convenience (computed at client if not provided)
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface BlogDto {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  authorDisplayName: string;
  tags: string[];
  categories: string[];
  createdUtc: string; // ISO-8601
  updatedUtc?: string | null;
  publishedUtc?: string | null;
  isPublished: boolean;
}

export interface BlogCreateDto {
  title: string;
  content: string;
  summary?: string | null;
  tags: string[];
  categories: string[];
  publish: boolean;
}

export interface BlogUpdateDto {
  title: string;
  content: string;
  summary?: string | null;
  tags: string[];
  categories: string[];
  publish: boolean;
  unpublish: boolean;
}

export interface CommentDto {
  id: string;
  blogId: string;
  authorDisplayName: string;
  content: string;
  createdUtc: string;
  updatedUtc?: string | null;
  isDeleted: boolean;
}

export interface TagDto {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  parentCategoryId?: string | null;
}

export interface ErrorDetails {
  [field: string]: string[];
}

export interface StandardErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ErrorDetails;
  };
}

// Query parameter types
export interface BlogListQuery {
  page?: number;
  pageSize?: number;
  publishedOnly?: boolean;
  search?: string;
}

export interface CommentListQuery {
  page?: number;
  pageSize?: number;
}

// Client-side augmented model for UI convenience
export interface BlogListItem extends BlogDto {
  readMinutes?: number; // computed estimate
}

// Helper to normalize paged result (compute derived fields if absent)
export function enhancePagedResult<T>(r: PagedResult<T>): PagedResult<T> {
  const totalPages = r.totalPages ?? (r.pageSize === 0 ? 0 : Math.ceil(r.totalCount / r.pageSize));
  const hasNext = r.hasNext ?? r.page * r.pageSize < r.totalCount;
  const hasPrevious = r.hasPrevious ?? r.page > 1;
  return { ...r, totalPages, hasNext, hasPrevious };
}
