import { useId, type ChangeEvent, type SelectHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export type SelectOption = { value: string; label: string }

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'size' | 'onChange'
> & {
  label?: string
  hint?: string
  error?: boolean
  errorMessage?: string
  options: SelectOption[]
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  /** По умолчанию true — на всю ширину контейнера */
  fullWidth?: boolean
  /** Доп. классы для &lt;select&gt; */
  selectClassName?: string
}

export default function Select({
  label,
  hint,
  error,
  errorMessage,
  options,
  onChange,
  id,
  disabled,
  className,
  selectClassName,
  fullWidth = true,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const showError = Boolean(error || errorMessage)

  return (
    <div
      className={cn(fullWidth ? 'w-full' : 'w-auto max-w-full', className)}
    >
      {label ? (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      ) : null}

      <div className="relative">
        <select
          id={selectId}
          disabled={disabled}
          onChange={onChange}
          className={cn(
            'block w-full cursor-pointer appearance-none rounded-md border bg-input-bg px-4 py-3 pr-10 text-sm text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-card-soft disabled:text-text-secondary',
            showError
              ? 'border-error focus-visible:ring-error/30'
              : 'border-border',
            selectClassName,
          )}
          {...props}
        >
          {options.map((opt, i) => (
            <option key={`${opt.value}-${i}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {showError && errorMessage ? (
        <div className="mt-1.5 text-sm text-error">{errorMessage}</div>
      ) : hint ? (
        <div className="mt-1.5 text-sm text-text-secondary">{hint}</div>
      ) : null}
    </div>
  )
}
