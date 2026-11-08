import { clearLastAnalysisId } from './analysisApi'
import { IS_LIVE_MODE } from './config'
import { isMockAccessToken, isMockRefreshToken, MOCK_ACCESS_TOKEN } from './constants'
import type { AuthResponse } from './types'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

/** Legacy keys from предыдущей inline-fetch интеграции и mock-login. */
const LEGACY_TOKEN_KEY = 'token'
const LEGACY_USER_KEY = 'user'
const LEGACY_AUTH_KEY = 'auth'

const APP_API_MODE_KEY = 'app_api_mode'

const STALE_AUTH_KEYS = [
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  LEGACY_TOKEN_KEY,
  LEGACY_USER_KEY,
  LEGACY_AUTH_KEY,
] as const

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? localStorage.getItem(LEGACY_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function saveAuthTokens(tokens: AuthResponse): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token)
  localStorage.removeItem(LEGACY_TOKEN_KEY)
  localStorage.removeItem(LEGACY_USER_KEY)
}

export function clearAuthTokens(): void {
  for (const key of STALE_AUTH_KEYS) {
    localStorage.removeItem(key)
  }
}

function clearStaleAuthStorage(): void {
  for (const key of STALE_AUTH_KEYS) {
    localStorage.removeItem(key)
  }
  clearLastAnalysisId()
}

/**
 * Синхронизация сессии при смене mock ↔ live и очистка mock-токенов в live mode.
 * Вызывается при старте приложения.
 */
export function syncApiModeSession(): void {
  const currentMode = IS_LIVE_MODE ? 'live' : 'mock'
  const storedMode = localStorage.getItem(APP_API_MODE_KEY)

  const modeSwitched = storedMode !== null && storedMode !== currentMode
  const mockSessionInLive =
    IS_LIVE_MODE &&
    (isMockAccessToken(getAccessToken()) || isMockRefreshToken(getRefreshToken()))

  if (modeSwitched || mockSessionInLive) {
    clearStaleAuthStorage()
  }

  localStorage.setItem(APP_API_MODE_KEY, currentMode)
}

/** @deprecated Используйте syncApiModeSession */
export function clearMockSessionIfLive(): void {
  syncApiModeSession()
}

export function isAuthenticated(): boolean {
  const token = getAccessToken()
  if (!token?.trim()) return false

  // В live-режиме mock-токен не считается авторизацией
  if (IS_LIVE_MODE && (isMockAccessToken(token) || isMockRefreshToken(getRefreshToken()))) {
    return false
  }

  return true
}

export { MOCK_ACCESS_TOKEN }
