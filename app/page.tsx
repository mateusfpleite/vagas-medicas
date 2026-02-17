import { fetchVagas, fetchFilterOptions, fetchStats, fetchSpecialtyCounts } from '@/lib/queries'
import { Hero } from './_components/Hero'
import { SpecialtyPicks } from './_components/SpecialtyPicks'
import { VagaList } from './_components/VagaList'

type Props = {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams

  const [{ vagas, count }, { specialties, cities, states }, stats, specialtyCounts] =
    await Promise.all([
      fetchVagas({
        specialty: params.specialty,
        city: params.city ? params.city.split(',') : undefined,
        state: params.state,
        q: params.q,
        page: params.page ? Number(params.page) : undefined,
      }),
      fetchFilterOptions(params.state ? { state: params.state } : undefined),
      fetchStats(),
      fetchSpecialtyCounts(),
    ])

  return (
    <>
      <Hero stats={stats} />
      <SpecialtyPicks specialtyCounts={specialtyCounts} />
      <VagaList
        initialVagas={vagas}
        initialCount={count}
        specialties={specialties}
        cities={cities}
        states={states}
      />
    </>
  )
}
