import { cn } from '../../utils/cn'

export function Skeleton({ className }) {
  return <div className={cn('skeleton h-4 w-full', className)} />
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <Skeleton className="mt-5 h-9 w-full rounded-xl" />
    </div>
  )
}