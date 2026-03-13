import type { Metadata } from 'next'
import { fetchStats, fetchAllSpecialties } from '@/lib/queries'
import { organizationJsonLd } from '@/lib/structured-data'
import { Breadcrumbs, breadcrumbJsonLd } from '@/app/_components/Breadcrumbs'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://empregamed.com.br'

export const metadata: Metadata = {
  title: 'Sobre o EmpregaMed',
  description:
    'O EmpregaMed é o maior agregador de vagas médicas do Brasil. Saiba como funciona, quantas vagas temos e quais fontes utilizamos.',
  alternates: { canonical: '/sobre' },
  openGraph: {
    title: 'Sobre o EmpregaMed',
    description:
      'O EmpregaMed é o maior agregador de vagas médicas do Brasil.',
    url: `${BASE_URL}/sobre`,
  },
}

export const revalidate = 3600

export default async function SobrePage() {
  const stats = await fetchStats()
  const specialties = await fetchAllSpecialties()

  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Sobre' },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            organizationJsonLd(),
            breadcrumbJsonLd(crumbs),
          ]),
        }}
      />
      <section className="border-b border-cream-dark bg-gradient-to-b from-white to-cream">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Breadcrumbs crumbs={crumbs} />
          <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-ink sm:text-4xl">
            Sobre o EmpregaMed
          </h1>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-lg leading-relaxed text-ink-light">
          O EmpregaMed é o maior agregador de vagas médicas do Brasil. Reunimos{' '}
          <strong className="text-ink">{stats.totalVagas.toLocaleString('pt-BR')} vagas</strong> de{' '}
          <strong className="text-ink">5 fontes</strong> diferentes, cobrindo{' '}
          <strong className="text-ink">{specialties.length} especialidades</strong> em{' '}
          <strong className="text-ink">{stats.totalCities.toLocaleString('pt-BR')} cidades</strong> de{' '}
          <strong className="text-ink">{stats.totalStates} estados</strong> brasileiros.
        </p>

        <h2 className="mt-10 font-[family-name:var(--font-serif)] text-2xl font-bold text-ink">
          Como funciona
        </h2>
        <p className="mt-3 leading-relaxed text-ink-light">
          Nossos crawlers automatizados visitam diariamente os principais sites de emprego do Brasil
          — Indeed, BNE, Vagas.com, InfoJobs e PCI Concursos — e coletam todas as vagas destinadas
          a médicos. Cada vaga é normalizada, classificada por especialidade e disponibilizada em
          nossa plataforma com filtros por especialidade, estado e cidade.
        </p>

        <h2 className="mt-10 font-[family-name:var(--font-serif)] text-2xl font-bold text-ink">
          Nossa missão
        </h2>
        <p className="mt-3 leading-relaxed text-ink-light">
          Facilitar a busca de emprego para médicos no Brasil. Em vez de visitar múltiplos sites de
          emprego, o médico encontra todas as oportunidades em um só lugar, com filtros especializados
          para a área médica.
        </p>

        <h2 className="mt-10 font-[family-name:var(--font-serif)] text-2xl font-bold text-ink">
          Fontes de dados
        </h2>
        <ul className="mt-3 space-y-2 text-ink-light">
          <li><strong className="text-ink">Indeed Brasil</strong> — Maior site de empregos do mundo</li>
          <li><strong className="text-ink">BNE</strong> — Banco Nacional de Empregos</li>
          <li><strong className="text-ink">Vagas.com</strong> — Plataforma brasileira de recrutamento</li>
          <li><strong className="text-ink">InfoJobs</strong> — Portal de empregos com foco no Brasil</li>
          <li><strong className="text-ink">PCI Concursos</strong> — Concursos públicos e processos seletivos</li>
        </ul>

        <h2 className="mt-10 font-[family-name:var(--font-serif)] text-2xl font-bold text-ink">
          Especialidades cobertas
        </h2>
        <p className="mt-3 leading-relaxed text-ink-light">
          Cobrimos {specialties.length} especialidades médicas, incluindo:{' '}
          {specialties.join(', ')}.
        </p>
      </article>
    </>
  )
}
