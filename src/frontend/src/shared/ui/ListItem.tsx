import { type ReactNode } from 'react'
import { cn } from '../lib/cn'
import Badge from './Badge'

export type ListItemStatus = 'processing' | 'completed' | 'failed'

export type ListItemProps = {
  title: ReactNode
  secondary?: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
  status?: ListItemStatus
  className?: string
}

export default function ListItem({
  title,
  secondary,
  leading,
  trailing,
  status,
  className,
}: ListItemProps) {
  const statusBadge =
    status === 'processing' ? (
      <Badge variant="processing">В обработке</Badge>
    ) : status === 'completed' ? (
      <Badge variant="success">Готово</Badge>
    ) : status === 'failed' ? (
      <Badge variant="error">Ошибка</Badge>
    ) : null

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-md border border-border bg-card p-4',
        className,
      )}
    >
      {leading ? <div className="mt-0.5 shrink-0">{leading}</div> : null}

      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-text-main">{title}</div>
        {secondary ? (
          <div className="mt-1 text-sm text-text-secondary">{secondary}</div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-start gap-2">
        {trailing ?? statusBadge}
      </div>
    </div>
  )
}
