import { http } from './client'

export type Category = 'NOTICE' | 'QNA' | 'FREE'
export type SortField = 'title' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export interface Post {
  id: string
  userId: string
  title: string
  body: string
  category: Category
  tags: string[]
  createdAt: string
}

export interface PostsResponse {
  items: Post[]
  prevCursor: string | null
  nextCursor: string | null
}

export interface PostsParams {
  limit?: number
  prevCursor?: string
  nextCursor?: string
  sort?: SortField
  order?: SortOrder
  category?: Category
  search?: string
  from?: string
  to?: string
}

export interface CreatePostRequest {
  title: string
  body: string
  category: Category
  tags?: string[]
}

export interface UpdatePostRequest {
  title?: string
  body?: string
  category?: Category
  tags?: string[]
}

export const postsApi = {
  getAll: (params?: PostsParams) =>
    http.get<PostsResponse>('/posts', { params }),

  getOne: (id: string) =>
    http.get<Post>(`/posts/${id}`),

  create: (data: CreatePostRequest) =>
    http.post<Post>('/posts', data),

  update: (id: string, data: UpdatePostRequest) =>
    http.patch<Post>(`/posts/${id}`, data),

  delete: (id: string) =>
    http.delete(`/posts/${id}`),

  deleteAll: () =>
    http.delete('/posts'),
}

