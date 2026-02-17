'use client'

import { useEffect, useRef, useState } from 'react'
import { SiteStats } from '@/lib/types'

function AnimatedNumber({ target, duration = 800 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref} className="tabular-nums">{value.toLocaleString('pt-BR')}</span>
}

export function StatsBar({ stats }: { stats: SiteStats }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
      <div className="flex items-center gap-2 text-sm text-ink-light">
        <span className="text-2xl font-bold text-primary">
          <AnimatedNumber target={stats.totalVagas} />
        </span>
        <span>vagas abertas</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-ink-light">
        <span className="text-2xl font-bold text-primary">
          <AnimatedNumber target={stats.totalCities} />
        </span>
        <span>cidades</span>
      </div>
    </div>
  )
}
