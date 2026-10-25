import { api } from './client'
import type { HealthStatus } from './types'

export const healthApi = {
  check: () => api.get<HealthStatus>('/health'),
  checkDb: () => api.get<HealthStatus>('/health/db'),
  checkStorage: () => api.get<HealthStatus>('/health/storage'),
  checkMl: () => api.get<HealthStatus>('/health/ml'),
}
