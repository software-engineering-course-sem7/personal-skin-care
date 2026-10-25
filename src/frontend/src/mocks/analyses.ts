import type { AnalysisView } from '@/shared/api/analysisView'

export type AnalysisStatus = AnalysisView['status']
export type Analysis = AnalysisView

export const mockCurrentResult: Analysis = {
  id: 'analysis-1',
  date: '24 мая 2026',
  status: 'completed',
  skinType: 'Комбинированная кожа',
  description:
    'Обнаружена умеренная чувствительность, лёгкая склонность к сухости в области щёк и повышенная жирность в T-зоне.',
  shortDescription:
    'Умеренная чувствительность, сухость щёк и жирность T-зоны.',
  recommendations: [
    'Использовать мягкое очищающее средство утром и вечером',
    'Добавить увлажняющий крем с гиалуроновой кислотой',
    'Использовать SPF каждый день',
    'Избегать агрессивных скрабов',
  ],
  ingredients: ['Ниацинамид', 'Гиалуроновая кислота', 'Пантенол', 'Церамиды'],
}

export const mockHistoryAnalyses: Analysis[] = [
  mockCurrentResult,
  {
    id: 'analysis-2',
    date: '18 мая 2026',
    status: 'processing',
    skinType: 'Нормальная кожа',
    description:
      'Анализ выполняется. Результаты появятся после завершения обработки изображения.',
    shortDescription: 'Анализ в процессе обработки изображения.',
    recommendations: [],
    ingredients: [],
  },
  {
    id: 'analysis-3',
    date: '10 мая 2026',
    status: 'failed',
    skinType: '—',
    description:
      'Не удалось обработать изображение. Проверьте качество фото и попробуйте снова.',
    shortDescription: 'Ошибка обработки изображения.',
    recommendations: [],
    ingredients: [],
  },
  {
    id: 'analysis-4',
    date: '2 мая 2026',
    status: 'completed',
    skinType: 'Сухая кожа',
    description:
      'Выраженная склонность к обезвоживанию, участки шелушения в области носогубных складок.',
    shortDescription: 'Склонность к обезвоживанию и шелушению.',
    recommendations: [
      'Использовать плотный ночной крем',
      'Добавить сыворотку с гиалуроновой кислотой',
      'Избегать спиртосодержащих тоников',
    ],
    ingredients: ['Сквалан', 'Масло ши', 'Пантенол', 'Церамиды'],
  },
]

export { statusLabel } from '@/shared/api/analysisView'
