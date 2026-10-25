/** UI-модель результата/истории анализа (view layer, не backend DTO). */
export type AnalysisStatus = 'processing' | 'completed' | 'failed'

export type AnalysisView = {
  id: string
  date: string
  status: AnalysisStatus
  skinType: string
  description: string
  shortDescription: string
  recommendations: string[]
  ingredients: string[]
}

export function statusLabel(status: AnalysisStatus): string {
  if (status === 'completed') return 'Готово'
  if (status === 'processing') return 'В обработке'
  return 'Ошибка'
}

export function statusBadgeVariant(status: AnalysisStatus) {
  if (status === 'completed') return 'success' as const
  if (status === 'processing') return 'processing' as const
  return 'error' as const
}
