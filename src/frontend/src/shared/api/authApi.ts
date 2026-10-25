import { api } from './client'
import { IS_LIVE_MODE, USE_MOCK_ANALYSIS } from './config'
import {
  isMockAccessToken,
  isMockRefreshToken,
  MOCK_ACCESS_TOKEN,
  MOCK_REFRESH_TOKEN,
} from './constants'
import {
  clearAuthTokens,
  getRefreshToken,
  saveAuthTokens,
  syncApiModeSession,
} from './authStorage'
import { clearLastAnalysisId } from './analysisApi'
import type { AuthResponse, LoginRequest, LogoutRequest, RegisterRequest } from './types'

const MOCK_AUTH: AuthResponse = {
  access_token: MOCK_ACCESS_TOKEN,
  refresh_token: MOCK_REFRESH_TOKEN,
  token_type: 'Bearer',
}

function assertLiveAuthResponse(data: AuthResponse): AuthResponse {
  if (!data.access_token?.trim() || !data.refresh_token?.trim()) {
    throw new Error('Backend не вернул токены авторизации')
  }
  if (isMockAccessToken(data.access_token) || isMockRefreshToken(data.refresh_token)) {
    throw new Error('Получен mock-токен в live mode')
  }
  return data
}

export const authApi = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    if (!IS_LIVE_MODE) {
      saveAuthTokens(MOCK_AUTH)
      return MOCK_AUTH
    }

    syncApiModeSession()
    const response = await api.post<AuthResponse>('/auth/login', data)
    const tokens = assertLiveAuthResponse(response.data)
    saveAuthTokens(tokens)
    clearLastAnalysisId()
    return tokens
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    if (!IS_LIVE_MODE) {
      saveAuthTokens(MOCK_AUTH)
      return MOCK_AUTH
    }

    syncApiModeSession()
    const response = await api.post<AuthResponse>('/auth/register', data)
    const tokens = assertLiveAuthResponse(response.data)
    saveAuthTokens(tokens)
    clearLastAnalysisId()
    return tokens
  },

  async logout(): Promise<void> {
    const refreshToken = getRefreshToken()
    if (!USE_MOCK_ANALYSIS && refreshToken && refreshToken !== MOCK_REFRESH_TOKEN) {
      const payload: LogoutRequest = { refresh_token: refreshToken }
      await api.post('/auth/logout', payload)
    }
    clearAuthTokens()
    clearLastAnalysisId()
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    saveAuthTokens(response.data)
    return response.data
  },
}
