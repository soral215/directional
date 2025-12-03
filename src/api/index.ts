export { http, client } from './client'
export { authApi } from './auth'
export { postsApi } from './posts'
export { chartsApi } from './charts'
export const healthApi = {
  check: () => import('./client').then(({ http }) => http.get('/health')),
}
export type {
  Post,
  PostsResponse,
  PostsParams,
  CreatePostRequest,
  UpdatePostRequest,
  Category,
  SortField,
  SortOrder,
} from './posts'
export type {
  CoffeeBrand,
  SnackBrand,
  WeeklyMood,
  WeeklyWorkout,
  CoffeeConsumptionSeries,
  CoffeeConsumptionTeam,
  CoffeeConsumptionResponse,
  SnackImpactMetrics,
  SnackImpactDepartment,
  SnackImpactResponse,
} from './charts'
export type { ApiResponse, ApiError, RequestConfig } from './types'
