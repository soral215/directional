import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { RequestConfig } from './types'
import { useAuthStore } from '../stores/authStore'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const createClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return instance
}

const client = createClient()

export const http = {
  get: <T>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>> =>
    client.get<T>(url, config as AxiosRequestConfig),

  post: <T>(url: string, data?: unknown, config?: RequestConfig): Promise<AxiosResponse<T>> =>
    client.post<T>(url, data, config as AxiosRequestConfig),

  patch: <T>(url: string, data?: unknown, config?: RequestConfig): Promise<AxiosResponse<T>> =>
    client.patch<T>(url, data, config as AxiosRequestConfig),

  put: <T>(url: string, data?: unknown, config?: RequestConfig): Promise<AxiosResponse<T>> =>
    client.put<T>(url, data, config as AxiosRequestConfig),

  delete: <T>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>> =>
    client.delete<T>(url, config as AxiosRequestConfig),
}

export { client }
