import { cn } from '@/utils/helpers'

const variants = {
  default: 'bg-sand-200 text-sand-600',
  new:     'bg-green-100 text-green-700',
  hot:     'bg-orange-100 text-orange-700',
  danger:  'bg-red-100 text-red-700',
  info:    'bg-blue-100 text-blue-700',
}

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
