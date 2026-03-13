import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { fetchVagas, fetchFilterOptions, fetchAllSpecialties, fetchCountBySpecialty } from '@/lib/queries'
import { toSlug } from '@/lib/slugs'

import { VagaList } from '@/app/_components/VagaList'
import { Breadcrumbs, breadcrumbJsonLd } from '@/app/_components/Breadcrumbs'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://empregamed.com.br'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

export const revalidate = 3600

async function resolveSpecialty(slug: string): Promise<string | null> {
  const specialties = await fetchAllSpecialties()
  return specialties.find((s) => toSlug(s) === slug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const specialty = await resolveSpecialty(slug)
  if (!specialty) return {}

  const count = await fetchCountBySpecialty(specialty)
  const title = `Vagas de ${specialty}`
  const description = `${count} vagas de ${specialty} agregadas de Indeed, BNE, Vagas.com, InfoJobs e PCI Concursos.`

  return {
    title,
    description,
    alternates: { canonical: `/especialidade/${slug}` },
    openGraph: {
      title: `${title} | EmpregaMed`,
      description,
      url: `${BASE_URL}/especialidade/${slug}`,
    },
  }
}

export default async function SpecialtyPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const specialty = await resolveSpecialty(slug)
  if (!specialty) notFound()

  const page = sp.page ? Number(sp.page) : undefined
  const { vagas, count } = await fetchVagas({ specialty, page })
  const { specialties, cities, states } = await fetchFilterOptions()

  const crumbs = [
    { label: 'Inicio', href: '/' },
    { label: specialty },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }}
      />
      <section className="border-b border-cream-dark bg-gradient-to-b from-white to-cream">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Breadcrumbs crumbs={crumbs} />
          <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-ink sm:text-4xl">
            Vagas de {specialty}
          </h1>
          <p className="mt-2 text-ink-muted">
            {count} {count === 1 ? 'vaga encontrada' : 'vagas encontradas'} em todo o Brasil.
          </p>
        </div>
      </section>
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
