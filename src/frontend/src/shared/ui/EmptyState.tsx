import { type ReactNode } from 'react'
import Button from './Button'
import { cn } from '../lib/cn'

export type EmptyStateProps = {
  title: string
  description?: string
  icon?: ReactNode
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-border bg-card-soft p-8 text-center',
        className,
      )}
    >
      {icon ? <div className="mx-auto mb-3">{icon}</div> : null}
      <div className="text-lg font-semibold text-text-main">{title}</div>
      {description ? (
        <div className="mt-2 text-sm text-text-secondary">{description}</div>
      ) : null}

      {actionLabel && onAction ? (
        <div className="mt-5">
          <Button variant="secondary" type="button" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
