const FAQS = [
  {
    question: 'O que e o EmpregaMed?',
    answer:
      'O EmpregaMed e o maior agregador de vagas medicas do Brasil. Reunimos oportunidades de Indeed, BNE, Vagas.com, InfoJobs e PCI Concursos em um so lugar, cobrindo 31 especialidades medicas.',
  },
  {
    question: 'O EmpregaMed e gratuito?',
    answer:
      'Sim, o EmpregaMed e totalmente gratuito para medicos. Basta acessar o site, filtrar por especialidade, estado ou cidade e clicar na vaga para ser redirecionado ao site original.',
  },
  {
    question: 'Com que frequencia as vagas sao atualizadas?',
    answer:
      'Nossos crawlers automatizados atualizam as vagas diariamente, garantindo que voce veja as oportunidades mais recentes.',
  },
  {
    question: 'Quais especialidades medicas estao disponiveis?',
    answer:
      'Cobrimos 31 especialidades, incluindo Cardiologia, Ortopedia, Pediatria, Clinica Geral, Ginecologia, Dermatologia, Psiquiatria, Neurologia, Cirurgia Geral, Medicina do Trabalho, entre outras.',
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
