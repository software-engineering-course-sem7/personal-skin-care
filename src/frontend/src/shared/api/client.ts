import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from './config'
import { isMockAccessToken, isMockRefreshToken } from './constants'
import { clearAuthTokens, getAccessToken, getRefreshToken, saveAuthTokens } from './authStorage'
import type { AuthResponse } from './types'

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined
    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isMockAccessToken(getAccessToken()) ||
      isMockRefreshToken(getRefreshToken())
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        throw error
      }

      const response = await api.post<AuthResponse>('/auth/refresh', {
        refresh_token: refreshToken,
      })

      saveAuthTokens(response.data)
      originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`
      return api(originalRequest)
    } catch (refreshError) {
      clearAuthTokens()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    }
  },
)
