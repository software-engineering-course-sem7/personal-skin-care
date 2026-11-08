import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'

export function ProfileIconLink({ className }: { className?: string }) {
  return (
    <Link
      to="/settings"
      className={cn(
        'inline-flex rounded-full p-1 text-text-secondary transition-colors hover:text-text-main',
        className,
      )}
      aria-label="Профиль и настройки"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle
          cx="12"
          cy="9"
          r="3.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M5 19.5c.5-3.5 3.5-5 7-5s6.5 1.5 7 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  )
}
