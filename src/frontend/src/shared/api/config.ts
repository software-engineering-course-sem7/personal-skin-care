/**
 * Парсинг boolean env-переменных Vite.
 * Vite всегда отдаёт строки; без .env переменная = undefined → defaultValue.
 */
function readEnvFlag(raw: string | undefined, defaultValue: boolean): boolean {
  if (raw === undefined || raw === '') {
    return defaultValue
  }

  const normalized = String(raw).trim().toLowerCase()
  if (normalized === 'true' || normalized === '1') return true
  if (normalized === 'false' || normalized === '0') return false

  return defaultValue
}

/**
 * Base URL для axios.
 * Dev + live: пустая строка → относительные пути (/auth/login) через Vite proxy → :8080.
 * Prod: VITE_API_URL или fallback на backend origin.
 */
function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim()

  if (!raw || raw === '/') {
    return import.meta.env.DEV ? '' : 'http://localhost:8080'
  }

  // localhost:8080 в dev обходит proxy и ломается на CORS — принудительно через proxy
  if (import.meta.env.DEV && /^https?:\/\/(?:127\.0\.0\.1|localhost):8080\/?$/i.test(raw)) {
    console.warn(
      '[api] VITE_API_URL указывает на :8080 — в dev используем Vite proxy (baseURL="")',
    )
    return ''
  }

  return raw.replace(/\/$/, '')
}

export const API_BASE_URL = resolveApiBaseUrl()

/**
 * Mock-режим: true → без backend (демо).
 * Live-режим: создайте .env с VITE_USE_MOCK_ANALYSIS=false и перезапустите dev-сервер.
 */
export const USE_MOCK_ANALYSIS = readEnvFlag(import.meta.env.VITE_USE_MOCK_ANALYSIS, true)

/** Явный флаг live backend (инверсия mock). */
export const IS_LIVE_MODE = !USE_MOCK_ANALYSIS

if (import.meta.env.DEV) {
  console.info(
    `[api] ${IS_LIVE_MODE ? 'LIVE' : 'MOCK'} mode | USE_MOCK_ANALYSIS=${USE_MOCK_ANALYSIS} | VITE_USE_MOCK_ANALYSIS=${String(import.meta.env.VITE_USE_MOCK_ANALYSIS)} | baseURL=${API_BASE_URL || '(vite proxy → :8080)'}`,
  )
}
