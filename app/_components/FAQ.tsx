const FAQS = [
  {
    question: 'O que é o EmpregaMed?',
    answer:
      'O EmpregaMed é o maior agregador de vagas médicas do Brasil. Reunimos oportunidades de Indeed, BNE, Vagas.com, InfoJobs e PCI Concursos em um só lugar, cobrindo 31 especialidades médicas.',
  },
  {
    question: 'O EmpregaMed é gratuito?',
    answer:
      'Sim, o EmpregaMed é totalmente gratuito para médicos. Basta acessar o site, filtrar por especialidade, estado ou cidade e clicar na vaga para ser redirecionado ao site original.',
  },
  {
    question: 'Com que frequência as vagas são atualizadas?',
    answer:
      'Nossos crawlers automatizados atualizam as vagas diariamente, garantindo que você veja as oportunidades mais recentes.',
  },
  {
    question: 'Quais especialidades médicas estão disponíveis?',
    answer:
      'Cobrimos 31 especialidades, incluindo Cardiologia, Ortopedia, Pediatria, Clínica Geral, Ginecologia, Dermatologia, Psiquiatria, Neurologia, Cirurgia Geral, Medicina do Trabalho, entre outras.',
  },
]

export function FAQ() {
  return (
    <section className="border-t border-cream-dark py-12">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-ink">
          Perguntas frequentes
        </h2>
        <dl className="mt-6 space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.question}>
              <dt className="font-semibold text-ink">{faq.question}</dt>
              <dd className="mt-1 leading-relaxed text-ink-light">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
