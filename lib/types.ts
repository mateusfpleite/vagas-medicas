export type Vaga = {
  id: number
  title: string
  specialty: string | null
  company: string | null
  city: string | null
  state: string | null
  salary: string | null
  salary_min: number | null
  salary_max: number | null
  salary_period: string | null
  job_type: string | null
  source: string
  url: string
  description: string | null
  benefits: string[] | null
  effective_date: string
}

export type SiteStats = {
  totalVagas: number
  newToday: number
  newThisWeek: number
  totalCities: number
  totalStates: number
}

export type SpecialtyCount = {
  specialty: string
  count: number
}
