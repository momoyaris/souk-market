import { cn } from '@/utils/helpers'

export function Skeleton({ className }) {
  return (
    <div
      className={cn('shimmer rounded-xl bg-sand-200', className)}
      aria-hidden="true"
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-sand-200 shadow-card">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  )
}
