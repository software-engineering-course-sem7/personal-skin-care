import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  mockHistoryAnalyses,
  statusLabel,
  type AnalysisStatus,
} from '@/mocks/analyses'
import { AppPageShell } from '@/shared/layout/AppPageShell'
import { PageCenter, PageSection } from '@/shared/layout/PageContent'
import {
  analysisApi,
  getApiError,
  statusBadgeVariant,
  statusLabel,
  type AnalysisStatus,
  type AnalysisView,
} from '@/shared/api'
import Badge from '@/shared/ui/Badge'
import Button from '@/shared/ui/Button'
import Card from '@/shared/ui/Card'
import EmptyState from '@/shared/ui/EmptyState'
import ListItem from '@/shared/ui/ListItem'
import Spinner from '@/shared/ui/Spinner'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
  const [analyses, setAnalyses] = useState<AnalysisView[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const items = await analysisApi.getHistoryView()
      setAnalyses(items)
    } catch (err) {
      setError(getApiError(err).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadHistory()
  }, [loadHistory])

  const filteredAnalyses = useMemo(
    () =>
      activeFilter === 'all'
        ? analyses
        : analyses.filter((item) => item.status === activeFilter),
    [activeFilter, analyses],
  )

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await analysisApi.deleteAnalysisView(id)
      setAnalyses((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(getApiError(err).message)
    } finally {
      setDeletingId(null)
    }
  }

  const handleOpen = (id: string) => {
    navigate(`/result/${id}`)
  }

  return (
    <AppPageShell showProfile>
      <PageCenter className="max-w-3xl gap-8">
        <PageSection>
          <h1 className="text-2xl font-bold text-text-main md:text-3xl">История запросов</h1>
        </PageSection>

        <PageSection className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              variant={activeFilter === filter.value ? 'primary' : 'secondary'}
              className="rounded-full px-4 py-2 text-sm shadow-none"
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </PageSection>

        {isLoading ? (
          <PageSection className="flex justify-center py-12">
            <Spinner size="lg" />
          </PageSection>
        ) : null}

        {error ? (
          <PageSection>
            <EmptyState
              className="border-0 bg-transparent"
              title="Не удалось загрузить историю"
              description={error}
              actionLabel="Повторить"
              onAction={() => void loadHistory()}
            />
          </PageSection>
        ) : null}

        {!isLoading && !error && filteredAnalyses.length === 0 ? (
          <PageSection>
            <EmptyState
              className="border-0 bg-transparent"
              title="История пуста"
              description="Загрузите фото, чтобы получить первый анализ."
              actionLabel="Прикрепить фото"
              onAction={() => navigate('/upload')}
            />
          </PageSection>
        ) : null}

        {!isLoading && !error ? (
          <PageSection className="space-y-4">
            {filteredAnalyses.map((item) => (
              <Card key={item.id} variant="default" className="!rounded-2xl !p-0 shadow-none">
                <ListItem
                  className="border-0 bg-transparent"
                  title={
                    <span className="text-base font-semibold">
                      {item.date} · {item.skinType}
                    </span>
                  }
                  secondary={item.shortDescription}
                  trailing={
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={statusBadgeVariant(item.status)} size="md">
                        {statusLabel(item.status)}
                      </Badge>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          className="rounded-full shadow-none"
                          onClick={() => handleOpen(item.id)}
                        >
                          Открыть
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="rounded-full text-error hover:bg-error/10 hover:text-error"
                          disabled={deletingId === item.id}
                          onClick={() => void handleDelete(item.id)}
                        >
                          {deletingId === item.id ? '…' : 'Удалить'}
                        </Button>
                      </div>
                    </div>
                  }
                />
              </Card>
            ))}
          </PageSection>
        ) : null}

        <PageSection className="flex justify-center pt-2">
          <Button
            type="button"
            variant="secondary"
            className="rounded-full px-8 py-3 shadow-none"
            onClick={() => navigate('/upload')}
          >
            Вернуться
          </Button>
        </PageSection>
      </PageCenter>
    </AppPageShell>
  )
}
