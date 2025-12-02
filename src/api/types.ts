export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiError {
  statusCode: number
  message: string
  error?: string
}

export interface RequestConfig {
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

