export function LoadingSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse-soft rounded-lg border border-cream-dark/60 bg-white p-5"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="h-4 w-2/3 rounded bg-cream-dark" />
          <div className="mt-2 h-3 w-1/3 rounded bg-cream-dark/60" />
          <div className="mt-3 flex gap-2">
            <div className="h-5 w-20 rounded-md bg-cream-dark/40" />
            <div className="h-5 w-16 rounded-md bg-cream-dark/40" />
          </div>
        </div>
      ))}
    </div>
  )
}
