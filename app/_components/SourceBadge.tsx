const SOURCE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  indeed: { label: 'Indeed', color: 'text-source-indeed', bg: 'bg-source-indeed/8' },
  vagas_com: { label: 'Vagas.com', color: 'text-source-vagas', bg: 'bg-source-vagas/8' },
  bne: { label: 'BNE', color: 'text-source-bne', bg: 'bg-source-bne/8' },
  infojobs: { label: 'InfoJobs', color: 'text-source-infojobs', bg: 'bg-source-infojobs/8' },
}

export function SourceBadge({ source }: { source: string }) {
  const config = SOURCE_CONFIG[source] ?? {
    label: source,
    color: 'text-ink-muted',
    bg: 'bg-ink/5',
  }

  return (
    <span className={`rounded-md px-2 py-0.5 text-[0.72rem] font-medium ${config.bg} ${config.color}`}>
      {config.label}
    </span>
  )
}
