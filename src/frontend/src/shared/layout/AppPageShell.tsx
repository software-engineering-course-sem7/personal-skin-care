import { type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { PdpWatermark } from './PdpWatermark'
import { ProfileIconLink } from './ProfileIconLink'

/** Высота верхней зелёной полосы: 36px */
const TOP_BAR_CLASS = 'h-9'

export type AppPageShellProps = {
  children: ReactNode
  /** Показать иконку профиля (Upload, Result, History) */
  showProfile?: boolean
  className?: string
}

export function AppPageShell({
  children,
  showProfile,
  className,
}: AppPageShellProps) {
  return (
    <div className={cn('relative min-h-screen bg-background', className)}>
      <div
        className={cn(
          'fixed top-0 left-0 right-0 z-40 w-full bg-accent-green',
          TOP_BAR_CLASS,
        )}
        aria-hidden
      />
      <PdpWatermark />
      {showProfile ? (
        <div
          className={cn(
            'absolute left-8 z-30 md:left-12',
            'top-[calc(2.25rem+0.75rem)] md:top-[calc(2.25rem+1rem)]',
          )}
        >
          <ProfileIconLink />
        </div>
      ) : null}
      <div className="relative z-10 pt-9">{children}</div>
    </div>
  )
}
