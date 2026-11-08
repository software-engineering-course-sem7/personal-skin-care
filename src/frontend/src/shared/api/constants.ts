/** Токены mock-режима — не должны использоваться при live backend. */
export const MOCK_ACCESS_TOKEN = 'mock-access-token'
export const MOCK_REFRESH_TOKEN = 'mock-refresh-token'

export function isMockAccessToken(token: string | null | undefined): boolean {
  return token === MOCK_ACCESS_TOKEN
}

export function isMockRefreshToken(token: string | null | undefined): boolean {
  return token === MOCK_REFRESH_TOKEN
}
