import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import Spinner from './Spinner'
import { cn } from '../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  className?: string
  disabled?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  leftIcon,
  rightIcon,
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-2 text-sm'
      : size === 'lg'
        ? 'px-5 py-3 text-base'
        : 'px-4 py-2.5 text-sm'

  const variantClasses =
    variant === 'primary'
      ? 'bg-primary hover:bg-primary-hover text-text-main border border-primary'
      : variant === 'secondary'
        ? 'bg-card border border-border text-text-main hover:bg-card-soft'
        : variant === 'danger'
          ? 'bg-error hover:bg-error/90 text-card border border-error'
          : 'bg-transparent border border-transparent text-text-main hover:bg-card-soft'

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors',
        sizeClasses,
        variantClasses,
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : leftIcon}
      {props.children}
      {loading ? null : rightIcon}
    </button>
  )
}
