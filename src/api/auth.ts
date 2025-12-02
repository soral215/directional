import { http } from './client'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  accessToken: string
}

export const authApi = {
  login: (data: LoginRequest) => http.post<LoginResponse>('/auth/login', data),
}

