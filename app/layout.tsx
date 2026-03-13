import type { Metadata } from 'next'
import { Fraunces, Source_Sans_3 } from 'next/font/google'
import { websiteJsonLd, organizationJsonLd } from '@/lib/structured-data'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://empregamed.com.br'

export const metadata: Metadata = {
  title: {
    default: 'EmpregaMed — Vagas medicas de todo o Brasil em um so lugar',
    template: '%s | EmpregaMed',
  },
  description:
    'Encontre vagas medicas agregadas de Indeed, BNE, Vagas.com, InfoJobs e PCI Concursos. Filtre por especialidade, cidade, estado e mais.',
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'EmpregaMed — Vagas medicas de todo o Brasil em um so lugar',
    description:
      'Encontre vagas medicas agregadas de Indeed, BNE, Vagas.com, InfoJobs e PCI Concursos. Filtre por especialidade, cidade, estado e mais.',
    url: BASE_URL,
    siteName: 'EmpregaMed',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EmpregaMed — Vagas medicas de todo o Brasil em um so lugar',
    description:
      'Encontre vagas medicas agregadas de Indeed, BNE, Vagas.com, InfoJobs e PCI Concursos.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([websiteJsonLd(), organizationJsonLd()]),
          }}
        />
      </head>
      <body className="font-[family-name:var(--font-sans)]">
        <main>{children}</main>
        <footer className="border-t border-cream-dark bg-cream-dark/30 py-10">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="font-[family-name:var(--font-serif)] text-lg text-ink">
                EmpregaMed
              </p>
              <a href="/sobre" className="text-xs text-ink-muted hover:text-primary hover:underline">
                Sobre
              </a>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                <span>Fontes:</span>
                <span className="font-medium text-source-indeed">Indeed</span>
                <span>·</span>
                <span className="font-medium text-source-bne">BNE</span>
                <span>·</span>
                <span className="font-medium text-source-vagas">Vagas.com</span>
                <span>·</span>
                <span className="font-medium text-source-infojobs">InfoJobs</span>
                <span>·</span>
                <span className="font-medium text-ink-light">PCI Concursos</span>
              </div>
              <p className="text-xs text-ink-faint">
                Atualizado diariamente · Dados agregados automaticamente
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
