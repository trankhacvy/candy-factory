export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export interface ServerActionResponse<T> {
  success: boolean
  data?: T
  error?: string
}
export interface BaseResponse<T> {
  statusCode: number
  error?: string
  data?: T
}

export interface BaseListResponse<T> {
  data: T[]
  hasNextPage: boolean
}

export interface PaginationRequest {
  limit?: number
  page?: number
}

export interface PageOptionRequest {
  order?: "ASC" | "DESC"
  page?: number
  take?: number
  q?: string
}

export interface Metadata {
  page: number
  take: number
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface BaseListResponseV2<T> {
  data: T[]
  meta: Metadata
}
