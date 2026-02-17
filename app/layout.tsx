import type { Metadata } from 'next'
import { Fraunces, Source_Sans_3 } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'Vagas Medicas — Oportunidades para medicos no Brasil',
  description:
    'Encontre vagas medicas agregadas dos principais sites de emprego do Brasil. Filtre por especialidade, cidade, estado e mais.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body className="font-[family-name:var(--font-sans)]">
        <main>{children}</main>
        <footer className="border-t border-cream-dark bg-cream-dark/30 py-10">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="font-[family-name:var(--font-serif)] text-lg text-ink">
                Vagas Medicas
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                <span>Fontes:</span>
                <span className="font-medium text-source-indeed">Indeed</span>
                <span>·</span>
                <span className="font-medium text-source-bne">BNE</span>
                <span>·</span>
                <span className="font-medium text-source-vagas">Vagas.com</span>
                <span>·</span>
                <span className="font-medium text-source-infojobs">InfoJobs</span>
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
