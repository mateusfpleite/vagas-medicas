import { freshnessLevel, timeAgo } from '@/lib/utils'

const STYLES = {
  today: 'bg-fresh-light text-fresh font-medium',
  yesterday: 'bg-fresh-light/60 text-fresh/80',
  'this-week': 'bg-cream-dark text-ink-muted',
  older: 'text-ink-faint',
} as const

export function FreshnessTag({ date }: { date: string }) {
  const level = freshnessLevel(date)
  const label = timeAgo(date)

  if (level === 'older') {
    return <span className={`text-xs ${STYLES.older}`}>{label}</span>
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs ${STYLES[level]}`}>
      {level === 'today' && (
        <span className="h-1.5 w-1.5 rounded-full bg-fresh animate-live-pulse" />
      )}
      {label}
    </span>
  )
}
