import { useId, type InputHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string
  hint?: string
  error?: boolean
  errorMessage?: string
  /** Classes for the native input element (e.g. rounded-full) */
  inputClassName?: string
}

export default function Input({
  label,
  hint,
  error,
  errorMessage,
  id,
  disabled,
  className,
  inputClassName,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const showError = Boolean(error || errorMessage)

  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      ) : null}

      <input
        id={inputId}
        disabled={disabled}
        className={cn(
          'block w-full rounded-md border px-4 py-3 text-sm bg-input-bg text-text-main placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          showError
            ? 'border-error focus-visible:ring-error/30'
            : 'border-border',
          disabled
            ? 'cursor-not-allowed bg-card-soft text-text-secondary'
            : null,
          inputClassName,
        )}
        {...props}
      />

      {showError && errorMessage ? (
        <div className="mt-1.5 text-sm text-error">{errorMessage}</div>
      ) : hint ? (
        <div className="mt-1.5 text-sm text-text-secondary">{hint}</div>
      ) : null}
    </div>
  )
}
