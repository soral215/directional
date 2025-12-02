import { http } from './client'

interface LoginRequest {
  email: string
  password: string
}

interface User {
  id: string
  email: string
}

interface LoginResponse {
  token: string
  user: User
}

export const authApi = {
  login: (data: LoginRequest) => http.post<LoginResponse>('/auth/login', data),
}
