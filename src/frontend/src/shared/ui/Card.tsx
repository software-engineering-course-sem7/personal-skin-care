import { type ReactNode } from 'react'
import { cn } from '../lib/cn'

export type CardVariant = 'default' | 'soft' | 'outline' | 'primary'

export type CardProps = {
  variant?: CardVariant
  className?: string
  children?: ReactNode
}

export default function Card({
  variant = 'default',
  className,
  children,
}: CardProps) {
  const variantClasses =
    variant === 'soft'
      ? 'border border-border bg-card-soft'
      : variant === 'outline'
        ? 'border border-border bg-transparent'
        : variant === 'primary'
          ? 'border border-primary bg-primary'
          : 'border border-border bg-card'

  return (
    <div className={cn('rounded-xl p-8', variantClasses, className)}>
      {children}
    </div>
  )
}
