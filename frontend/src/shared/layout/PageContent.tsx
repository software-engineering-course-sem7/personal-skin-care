import { type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export function PageCenter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-4xl flex-col items-stretch px-8 pb-20 pt-14 md:px-12 md:pt-20',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function PageSection({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('w-full', className)}>{children}</section>
}
