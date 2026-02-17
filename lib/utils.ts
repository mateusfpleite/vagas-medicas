import { Vaga } from './types'

export function formatSalary(vaga: Vaga): string | null {
  if (vaga.salary) return vaga.salary
  if (vaga.salary_min == null && vaga.salary_max == null) return null

  const fmt = (n: number) =>
    n.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    })

  const period =
    vaga.salary_period === 'HOURLY'
      ? '/h'
      : vaga.salary_period === 'YEARLY'
        ? '/ano'
        : '/mes'

  if (vaga.salary_min != null && vaga.salary_max != null) {
    return `${fmt(vaga.salary_min)} - ${fmt(vaga.salary_max)}${period}`
  }
  if (vaga.salary_min != null)
    return `A partir de ${fmt(vaga.salary_min)}${period}`
  return `Ate ${fmt(vaga.salary_max!)}${period}`
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days < 30) return `${days}d`
  const months = Math.floor(days / 30)
  return `${months}m`
}

export function freshnessLevel(dateStr: string): 'today' | 'yesterday' | 'this-week' | 'older' {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return 'this-week'
  return 'older'
}
