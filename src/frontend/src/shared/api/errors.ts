import axios from 'axios'
import type { ErrorResponse } from './types'

export type ApiErrorInfo = {
  message: string
  code?: string
  status?: number
}

export function getApiError(error: unknown): ApiErrorInfo {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    const data = error.response?.data
    return {
      message: data?.message ?? 'Ошибка соединения с сервером',
      code: data?.code,
      status: error.response?.status,
    }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: 'Ошибка соединения с сервером' }
}

export function isUnauthorized(error: unknown): boolean {
  return getApiError(error).status === 401
}
