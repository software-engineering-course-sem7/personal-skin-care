import type { AnalysisView } from './analysisView'
import type {
  AnalysisDetail,
  AnalysisListItem,
  AnalysisStatus,
  Gender,
  UpdateUserRequest,
  User,
} from './types'

const SKIN_TYPE_LABELS: Record<string, string> = {
  oily: 'Жирная кожа',
  dry: 'Сухая кожа',
  normal: 'Нормальная кожа',
  combination: 'Комбинированная кожа',
}

export function formatAnalysisDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function extractDescription(
  data: Record<string, unknown> | null,
  status: AnalysisStatus,
): string {
  if (status === 'processing') {
    return 'Анализ выполняется. Результаты появятся после завершения обработки изображения.'
  }
  if (status === 'failed') {
    return 'Не удалось обработать изображение. Проверьте качество фото и попробуйте снова.'
  }
  if (!data) {
    return 'Описание анализа недоступно.'
  }
  if (typeof data.description === 'string' && data.description.trim()) {
    return data.description
  }
  if (typeof data.summary === 'string' && data.summary.trim()) {
    return data.summary
  }
  return 'Результаты анализа готовы. Смотрите рекомендации и подходящие ингредиенты ниже.'
}

function shortDescriptionFromDetail(detail: AnalysisDetail): string {
  const description = extractDescription(detail.analysis_data, detail.status)
  if (description.length <= 96) return description
  return `${description.slice(0, 93)}…`
}

export function analysisDetailToView(detail: AnalysisDetail): AnalysisView {
  const description = extractDescription(detail.analysis_data, detail.status)

  return {
    id: detail.id,
    date: formatAnalysisDate(detail.created_at),
    status: detail.status,
    skinType: skinTypeLabel(detail.skin_type),
    description,
    shortDescription: shortDescriptionFromDetail(detail),
    recommendations:
      detail.recommendations?.map((item) =>
        item.description && item.description !== item.title
          ? `${item.title}. ${item.description}`
          : item.title,
      ) ?? [],
    ingredients: detail.ingredients?.map((item) => item.name) ?? [],
  }
}

export function analysisListItemToView(item: AnalysisListItem): AnalysisView {
  const skinType = skinTypeLabel(item.skin_type)
  const shortDescription =
    item.status === 'processing'
      ? 'Анализ в процессе обработки изображения.'
      : item.status === 'failed'
        ? 'Ошибка обработки изображения.'
        : `Тип кожи: ${skinType}`

  return {
    id: item.id,
    date: formatAnalysisDate(item.created_at),
    status: item.status,
    skinType,
    description: '',
    shortDescription,
    recommendations: [],
    ingredients: [],
  }
}

export function genderToApi(value: string): Gender | null {
  if (value === 'Ж') return 'female'
  if (value === 'М') return 'male'
  return null
}

export function genderFromApi(value: Gender | null | undefined): string {
  if (value === 'female') return 'Ж'
  if (value === 'male') return 'М'
  return ''
}

export function birthDateToApi(value: string): string | null {
  if (!value) return null
  return `${value}T00:00:00.000Z`
}

export function birthDateFromApi(value: string | null | undefined): string {
  if (!value) return ''
  return value.split('T')[0] ?? ''
}

export function userToForm(user: User) {
  return {
    email: user.email,
    fullName: user.name,
    birthDate: birthDateFromApi(user.birth_date),
    gender: genderFromApi(user.gender),
  }
}

export function formToUpdateUserRequest(payload: {
  email: string
  fullName: string
  birthDate: string
  gender: string
}): UpdateUserRequest {
  return {
    email: payload.email.trim(),
    name: payload.fullName.trim(),
    birth_date: birthDateToApi(payload.birthDate),
    gender: genderToApi(payload.gender),
  }
}

export function skinTypeLabel(skinType: string | null | undefined): string {
  if (!skinType) return '—'
  return SKIN_TYPE_LABELS[skinType] ?? skinType
}
