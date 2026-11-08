export type SpinnerSize = 'sm' | 'md' | 'lg'

export type SpinnerProps = {
  size?: SpinnerSize
  className?: string
}

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  const dim =
    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'

  return (
    <span
      aria-label="Loading"
      className={[
        'inline-block animate-spin rounded-full border-2 border-text-main/20 border-t-text-main',
        dim,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
