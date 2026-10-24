import { useNavigate } from 'react-router-dom'
import { mockCurrentResult } from '@/mocks/analyses'
import { AppPageShell } from '@/shared/layout/AppPageShell'
import { PageCenter, PageSection } from '@/shared/layout/PageContent'
import {
  analysisApi,
  getApiError,
  getLastAnalysisId,
  statusBadgeVariant,
  statusLabel,
  type AnalysisView,
} from '@/shared/api'
import Badge from '@/shared/ui/Badge'
import Button from '@/shared/ui/Button'
import Card from '@/shared/ui/Card'
import EmptyState from '@/shared/ui/EmptyState'
import Spinner from '@/shared/ui/Spinner'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function ResultPageContent({ analysisId }: { analysisId: string }) {
  const navigate = useNavigate()
  const [result, setResult] = useState<AnalysisView | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    void analysisApi
      .getDetailView(analysisId, { poll: true })
      .then((data) => {
        if (!cancelled) setResult(data)
      })
      .catch((err) => {
        if (!cancelled) setError(getApiError(err).message)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [analysisId])

  if (isLoading) {
    return (
      <AppPageShell showProfile>
        <PageCenter className="min-h-[50vh] items-center justify-center gap-4">
          <Spinner size="lg" />
          <p className="text-center text-text-secondary">Загрузка результата…</p>
        </PageCenter>
      </AppPageShell>
    )
  }

  if (error) {
    return (
      <AppPageShell showProfile>
        <PageCenter className="min-h-[50vh] justify-center">
          <EmptyState
            className="max-w-lg border-0 bg-transparent"
            title="Не удалось загрузить результат"
            description={error}
            actionLabel="К истории"
            onAction={() => navigate('/history')}
          />
        </PageCenter>
      </AppPageShell>
    )
  }

  if (!result) {
    return null
  }

  return (
    <AppPageShell showProfile>
      <PageCenter className="max-w-3xl gap-8">
        <PageSection className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-text-main md:text-3xl">Результат анализа</h1>
          <Badge variant={statusBadgeVariant(result.status)} size="md">
            {statusLabel(result.status)}
          </Badge>
        </PageSection>

        {result.status === 'processing' ? (
          <PageSection className="flex flex-col items-center gap-3 py-8">
            <Spinner size="lg" />
            <p className="text-center text-text-secondary">{result.description}</p>
          </PageSection>
        ) : null}

        {result.status === 'failed' ? (
          <PageSection>
            <Card variant="soft" className="!rounded-2xl !p-6 shadow-none">
              <p className="text-base leading-relaxed text-error">{result.description}</p>
            </Card>
          </PageSection>
        ) : null}

        {result.status === 'completed' ? (
          <PageSection className="grid gap-5">
            <Card variant="soft" className="!rounded-2xl !p-6 shadow-none">
              <p className="text-sm font-medium text-text-secondary">Тип кожи</p>
              <p className="mt-2 text-lg font-semibold text-text-main">{result.skinType}</p>
            </Card>

            <Card variant="soft" className="!rounded-2xl !p-6 shadow-none">
              <p className="text-sm font-medium text-text-secondary">Описание</p>
              <p className="mt-2 text-base leading-relaxed text-text-main">{result.description}</p>
            </Card>

            {result.recommendations.length > 0 ? (
              <Card variant="soft" className="!rounded-2xl !p-6 shadow-none">
                <p className="text-sm font-medium text-text-secondary">Рекомендации</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-text-main">
                  {result.recommendations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            ) : null}

            {result.ingredients.length > 0 ? (
              <Card variant="soft" className="!rounded-2xl !p-6 shadow-none">
                <p className="text-sm font-medium text-text-secondary">Ингредиенты</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.ingredients.map((item) => (
                    <Badge key={item} variant="neutral" size="md" className="rounded-full">
                      {item}
                    </Badge>
                  ))}
                </div>
              </Card>
            ) : null}

            <Card variant="outline" className="!rounded-2xl !p-5 shadow-none">
              <p className="text-sm text-text-secondary">
                Дата анализа:{' '}
                <span className="font-medium text-text-main">{result.date}</span>
              </p>
            </Card>
          </PageSection>
        ) : null}

        <PageSection className="flex justify-center pt-2">
          <Button
            type="button"
            variant="primary"
            className="rounded-full px-8 py-3 shadow-none"
            onClick={() => navigate('/history')}
          >
            История запросов
          </Button>
        </PageSection>
      </PageCenter>
    </AppPageShell>
  )
}

export default function ResultPage() {
  const navigate = useNavigate()
  const { id: routeId } = useParams<{ id?: string }>()
  const analysisId = routeId ?? getLastAnalysisId()

  if (!analysisId) {
    return (
      <AppPageShell showProfile>
        <PageCenter className="min-h-[50vh] justify-center">
          <EmptyState
            className="max-w-lg border-0 bg-transparent"
            title="Результат анализа не найден"
            description="Загрузите фото, чтобы получить анализ кожи."
            actionLabel="Прикрепить фото"
            onAction={() => navigate('/upload')}
          />
        </PageCenter>
      </AppPageShell>
    )
  }

  return <ResultPageContent key={analysisId} analysisId={analysisId} />
}
