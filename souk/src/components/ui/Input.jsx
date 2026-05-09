import { cn } from '@/utils/helpers'
import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, icon: Icon, className, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-sand-600 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400 pointer-events-none">
            <Icon size={16} />
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-white border border-sand-300 rounded-xl text-sand-900 placeholder-sand-400 font-sans text-sm transition-all duration-150',
            'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
            Icon ? 'pl-10 pr-4 py-3' : 'px-4 py-3',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  )
})

export default Input
