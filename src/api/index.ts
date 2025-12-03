export { http, client } from './client'
export { authApi } from './auth'
export { postsApi } from './posts'
export type {
  Post,
  PostsResponse,
  PostsParams,
  CreatePostRequest,
  UpdatePostRequest,
  Category,
} from './posts'
export type { ApiResponse, ApiError, RequestConfig } from './types'
