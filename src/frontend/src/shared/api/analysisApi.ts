import {
  mockCurrentResult,
  mockHistoryAnalyses,
} from '@/mocks/analyses'
import type { AnalysisView } from './analysisView'
import { api } from './client'
import { USE_MOCK_ANALYSIS } from './config'
import {
  analysisDetailToView,
  analysisListItemToView,
} from './mappers'
import type { AnalysisDetail, AnalysisListItem, CreateAnalysisResponse } from './types'

const LAST_ANALYSIS_ID_KEY = 'last_analysis_id'
const POLL_INTERVAL_MS = 2500
const MAX_POLL_ATTEMPTS = 48

export function setLastAnalysisId(id: string): void {
  sessionStorage.setItem(LAST_ANALYSIS_ID_KEY, id)
}

export function getLastAnalysisId(): string | null {
  return sessionStorage.getItem(LAST_ANALYSIS_ID_KEY)
}

export function clearLastAnalysisId(): void {
  sessionStorage.removeItem(LAST_ANALYSIS_ID_KEY)
}

async function pollAnalysisDetail(id: string): Promise<AnalysisView> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const detail = await fetchAnalysisDetail(id)
    if (detail.status !== 'processing') {
      return analysisDetailToView(detail)
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }

  const detail = await fetchAnalysisDetail(id)
  return analysisDetailToView(detail)
}

async function fetchAnalysisDetail(id: string): Promise<AnalysisDetail> {
  const response = await api.get<AnalysisDetail>(`/analyses/${id}`, {
    params: { recs_limit: 10, ings_limit: 10 },
  })
  return response.data
}

export const analysisApi = {
  /** POST /analyses — загрузка фото (поле form-data: photo). */
  async uploadPhoto(file: File): Promise<CreateAnalysisResponse> {
    if (USE_MOCK_ANALYSIS) {
      await new Promise((resolve) => setTimeout(resolve, 400))
      const mock: CreateAnalysisResponse = {
        id: mockCurrentResult.id,
        photo_id: 'mock-photo-id',
        file_url: '',
        status: 'completed',
        uploaded_at: new Date().toISOString(),
      }
      setLastAnalysisId(mock.id)
      return mock
    }

    const formData = new FormData()
    formData.append('photo', file)
    const response = await api.post<CreateAnalysisResponse>('/analyses', formData)
    setLastAnalysisId(response.data.id)
    return response.data
  },

  /** GET /analyses — список анализов. */
  async getHistory(offset = 0, limit = 10): Promise<AnalysisListItem[]> {
    const response = await api.get<AnalysisListItem[]>('/analyses', {
      params: { offset, limit },
    })
    return response.data
  },

  /** GET /analyses/:id — детальный результат. */
  async getDetail(id: string, recsLimit = 10, ingsLimit = 10): Promise<AnalysisDetail> {
    const response = await api.get<AnalysisDetail>(`/analyses/${id}`, {
      params: { recs_limit: recsLimit, ings_limit: ingsLimit },
    })
    return response.data
  },

  /** DELETE /analyses/:id */
  async deleteAnalysis(id: string): Promise<void> {
    await api.delete(`/analyses/${id}`)
  },

  /** UI-view истории. Mock или GET /analyses + mapper. */
  async getHistoryView(): Promise<AnalysisView[]> {
    if (USE_MOCK_ANALYSIS) {
      return mockHistoryAnalyses
    }

    const items = await this.getHistory(0, 100)
    return items.map(analysisListItemToView)
  },

  /**
   * UI-view результата. Mock или GET /analyses/:id + mapper.
   * poll: true — опрос статуса processing каждые ~2.5 с.
   */
  async getDetailView(id?: string, options?: { poll?: boolean }): Promise<AnalysisView> {
    if (USE_MOCK_ANALYSIS) {
      const resolvedId = id ?? getLastAnalysisId()
      if (resolvedId) {
        const found = mockHistoryAnalyses.find((item) => item.id === resolvedId)
        if (found) return found
      }
      return mockCurrentResult
    }

    const resolvedId = id ?? getLastAnalysisId()
    if (!resolvedId) {
      throw new Error('NO_ANALYSIS_ID')
    }

    if (options?.poll) {
      return pollAnalysisDetail(resolvedId)
    }

    const detail = await this.getDetail(resolvedId)
    return analysisDetailToView(detail)
  },

  /** Удаление анализа (mock noop или DELETE /analyses/:id). */
  async deleteAnalysisView(id: string): Promise<void> {
    if (USE_MOCK_ANALYSIS) {
      return
    }
    await this.deleteAnalysis(id)
  },
}
