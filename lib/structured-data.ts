const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://empregamed.com.br'

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EmpregaMed',
    url: BASE_URL,
    description:
      'Maior agregador de vagas médicas do Brasil. Reúne oportunidades de Indeed, BNE, Vagas.com, InfoJobs e PCI Concursos em um só lugar.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EmpregaMed',
    url: BASE_URL,
    description:
      'Agregador de vagas médicas do Brasil. Reúne oportunidades de múltiplos sites de emprego, cobrindo 31 especialidades médicas.',
  }
}
