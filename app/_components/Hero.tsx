import { SiteStats } from '@/lib/types'
import { StatsBar } from './StatsBar'

export function Hero({ stats }: { stats: SiteStats }) {
  return (
    <section className="relative overflow-hidden border-b border-cream-dark bg-gradient-to-b from-white to-cream">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      <div className="relative mx-auto max-w-5xl px-6 py-16 text-center sm:py-20">
        <h1
          className="animate-fade-slide-up font-[family-name:var(--font-serif)] text-4xl font-bold tracking-tight text-ink sm:text-5xl"
        >
          Todas as vagas medicas do Brasil.
          <br />
          <span className="text-primary">Em um so lugar.</span>
        </h1>
        <p
          className="animate-fade-slide-up mx-auto mt-4 max-w-lg text-ink-muted"
          style={{ animationDelay: '100ms' }}
        >
          Agregamos vagas de Indeed, BNE, Vagas.com e InfoJobs para voce nao precisar procurar em cada site.
        </p>
        <div className="animate-fade-slide-up" style={{ animationDelay: '200ms' }}>
          <StatsBar stats={stats} />
        </div>
      </div>
    </section>
  )
}
