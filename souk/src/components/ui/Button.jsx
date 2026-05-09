import { cn } from '@/utils/helpers'

const variants = {
  primary:  'bg-brand-500 text-white hover:bg-brand-400 active:bg-brand-600',
  ghost:    'bg-transparent border border-sand-300 text-sand-600 hover:border-sand-500 hover:text-sand-900',
  danger:   'bg-red-500 text-white hover:bg-red-400',
  outline:  'bg-transparent border border-brand-500 text-brand-500 hover:bg-brand-50',
  subtle:   'bg-sand-200 text-sand-700 hover:bg-sand-300',
}

const sizes = {
  sm:   'px-3 py-1.5 text-xs rounded-lg',
  md:   'px-5 py-2.5 text-sm rounded-xl',
  lg:   'px-7 py-3.5 text-base rounded-xl',
  pill: 'px-5 py-2.5 text-sm rounded-full',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading,
  fullWidth,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  )
}
