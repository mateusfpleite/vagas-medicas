import { fetchVagas, fetchFilterOptions, fetchStats, fetchSpecialtyCounts, fetchStateCounts } from '@/lib/queries'
import { Hero } from './_components/Hero'
import { SpecialtyPicks } from './_components/SpecialtyPicks'
import { PopularStates } from './_components/PopularStates'
import { VagaList } from './_components/VagaList'
import { FAQ, faqJsonLd } from './_components/FAQ'

type Props = {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams

  const { vagas, count } = await fetchVagas({
    specialty: params.specialty,
    city: params.city ? params.city.split(',') : undefined,
    state: params.state,
    q: params.q,
    page: params.page ? Number(params.page) : undefined,
  })
  const { specialties, cities, states } = await fetchFilterOptions(
    params.state ? { state: params.state } : undefined,
  )
  const stats = await fetchStats()
  const specialtyCounts = await fetchSpecialtyCounts()
  const stateCounts = await fetchStateCounts()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <Hero stats={stats} />
      <section className="border-b border-cream-dark bg-white/40 py-6">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm leading-relaxed text-ink-muted">
            O EmpregaMed agrega {stats.totalVagas.toLocaleString('pt-BR')} vagas medicas de 5 fontes
            brasileiras — Indeed, BNE, Vagas.com, InfoJobs e PCI Concursos — cobrindo 31
            especialidades em {stats.totalCities.toLocaleString('pt-BR')} cidades
            de {stats.totalStates} estados. Atualizado diariamente.
          </p>
        </div>
      </section>
      <SpecialtyPicks specialtyCounts={specialtyCounts} />
      <PopularStates stateCounts={stateCounts} />
      <VagaList
        initialVagas={vagas}
        initialCount={count}
        specialties={specialties}
        cities={cities}
        states={states}
      />
      <FAQ />
    </>
  )
}
