import 'server-only'

import { db } from './db'
import { vagasPublic } from './db/schema'
import { eq, and, inArray, isNotNull, desc, sql, count } from 'drizzle-orm'
import { Vaga, SiteStats, SpecialtyCount } from './types'

const PAGE_SIZE = 20

export type FetchVagasParams = {
  specialty?: string
  city?: string | string[]
  state?: string
  q?: string
  page?: number
}

export type FetchVagasResult = {
  vagas: Vaga[]
  count: number
}

export async function fetchVagas(params: FetchVagasParams): Promise<FetchVagasResult> {
  const { specialty, city, state, q, page = 1 } = params
  const offset = (page - 1) * PAGE_SIZE

  const conditions = []
  if (specialty) conditions.push(eq(vagasPublic.specialty, specialty))
  if (state) conditions.push(eq(vagasPublic.state, state))
  if (city) {
    const cities = Array.isArray(city) ? city : [city]
    conditions.push(cities.length === 1 ? eq(vagasPublic.city, cities[0]) : inArray(vagasPublic.city, cities))
  }

  if (q) {
    conditions.push(sql`unaccent(${vagasPublic.title}) ILIKE '%' || unaccent(${q}) || '%'`)
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const rows = await db
    .select({
      id: vagasPublic.id,
      title: vagasPublic.title,
      specialty: vagasPublic.specialty,
      company: vagasPublic.company,
      city: vagasPublic.city,
      state: vagasPublic.state,
      salary: vagasPublic.salary,
      salaryMin: vagasPublic.salaryMin,
      salaryMax: vagasPublic.salaryMax,
      salaryPeriod: vagasPublic.salaryPeriod,
      jobType: vagasPublic.jobType,
      source: vagasPublic.source,
      url: vagasPublic.url,
      effectiveDate: vagasPublic.effectiveDate,
      description: vagasPublic.description,
      benefits: vagasPublic.benefits,
      totalCount: sql<number>`count(*) over()`.as('total_count'),
    })
    .from(vagasPublic)
    .where(where)
    .orderBy(desc(vagasPublic.effectiveDate))
    .limit(PAGE_SIZE)
    .offset(offset)

  const total = rows[0]?.totalCount ?? 0

  const vagas: Vaga[] = rows.map((r) => ({
    id: r.id!,
    title: r.title!,
    specialty: r.specialty,
    company: r.company,
    city: r.city,
    state: r.state,
    salary: r.salary,
    salary_min: r.salaryMin ? Number(r.salaryMin) : null,
    salary_max: r.salaryMax ? Number(r.salaryMax) : null,
    salary_period: r.salaryPeriod,
    job_type: r.jobType,
    source: r.source!,
    url: r.url!,
    effective_date: r.effectiveDate?.split('T')[0] ?? '',
    description: r.description,
    benefits: r.benefits as string[] | null,
  }))

  return { vagas, count: total }
}

export type FilterOptions = {
  specialties: string[]
  cities: string[]
  states: string[]
}

export async function fetchFilterOptions(
  params?: { state?: string },
): Promise<FilterOptions> {
  const cityConditions = [isNotNull(vagasPublic.city)]
  if (params?.state) cityConditions.push(eq(vagasPublic.state, params.state))

  const [specialtiesRows, citiesRows, statesRows] = await Promise.all([
    db
      .selectDistinct({ specialty: vagasPublic.specialty })
      .from(vagasPublic)
      .where(isNotNull(vagasPublic.specialty))
      .orderBy(vagasPublic.specialty),
    db
      .selectDistinct({ city: vagasPublic.city })
      .from(vagasPublic)
      .where(and(...cityConditions))
      .orderBy(vagasPublic.city),
    db
      .selectDistinct({ state: vagasPublic.state })
      .from(vagasPublic)
      .where(isNotNull(vagasPublic.state))
      .orderBy(vagasPublic.state),
  ])

  return {
    specialties: specialtiesRows.map((r) => r.specialty!),
    cities: citiesRows.map((r) => r.city!),
    states: statesRows.map((r) => r.state!),
  }
}

export async function fetchStats(): Promise<SiteStats> {
  const today = new Date()
  const todayStr = today.toLocaleDateString('en-CA')
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekAgoStr = weekAgo.toLocaleDateString('en-CA')

  const [row] = await db
    .select({
      totalVagas: count(),
      newToday: sql<number>`count(*) filter (where ${vagasPublic.effectiveDate} >= ${todayStr})`,
      newThisWeek: sql<number>`count(*) filter (where ${vagasPublic.effectiveDate} >= ${weekAgoStr})`,
      totalCities: sql<number>`count(distinct ${vagasPublic.city}) filter (where ${vagasPublic.city} is not null)`,
      totalStates: sql<number>`count(distinct ${vagasPublic.state}) filter (where ${vagasPublic.state} is not null)`,
    })
    .from(vagasPublic)

  return {
    totalVagas: row.totalVagas,
    newToday: row.newToday,
    newThisWeek: row.newThisWeek,
    totalCities: row.totalCities,
    totalStates: row.totalStates,
  }
}

export async function fetchSpecialtyCounts(): Promise<SpecialtyCount[]> {
  const rows = await db
    .select({
      specialty: vagasPublic.specialty,
      count: count(),
    })
    .from(vagasPublic)
    .where(isNotNull(vagasPublic.specialty))
    .groupBy(vagasPublic.specialty)
    .orderBy(desc(count()))
    .limit(10)

  return rows.map((r) => ({
    specialty: r.specialty!,
    count: r.count,
  }))
}

/** All specialties that have at least one vaga. */
export async function fetchAllSpecialties(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ specialty: vagasPublic.specialty })
    .from(vagasPublic)
    .where(isNotNull(vagasPublic.specialty))
    .orderBy(vagasPublic.specialty)

  return rows.map((r) => r.specialty!)
}

/** All states that have at least one vaga. */
export async function fetchAllStates(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ state: vagasPublic.state })
    .from(vagasPublic)
    .where(isNotNull(vagasPublic.state))
    .orderBy(vagasPublic.state)

  return rows.map((r) => r.state!)
}

/** All cities for a given state that have at least one vaga. */
export async function fetchCitiesByState(state: string): Promise<string[]> {
  const rows = await db
    .selectDistinct({ city: vagasPublic.city })
    .from(vagasPublic)
    .where(and(eq(vagasPublic.state, state), isNotNull(vagasPublic.city)))
    .orderBy(vagasPublic.city)

  return rows.map((r) => r.city!)
}

/** Count vagas for a specialty (used in meta descriptions). */
export async function fetchCountBySpecialty(specialty: string): Promise<number> {
  const [row] = await db
    .select({ count: count() })
    .from(vagasPublic)
    .where(eq(vagasPublic.specialty, specialty))

  return row.count
}

/** Count vagas for a state (used in meta descriptions). */
export async function fetchCountByState(state: string): Promise<number> {
  const [row] = await db
    .select({ count: count() })
    .from(vagasPublic)
    .where(eq(vagasPublic.state, state))

  return row.count
}

/** All state+city pairs that have at least one vaga. Single query. */
export async function fetchAllStateCityPairs(): Promise<{ state: string; city: string }[]> {
  const rows = await db
    .selectDistinct({
      state: vagasPublic.state,
      city: vagasPublic.city,
    })
    .from(vagasPublic)
    .where(and(isNotNull(vagasPublic.state), isNotNull(vagasPublic.city)))
    .orderBy(vagasPublic.state, vagasPublic.city)

  return rows.map((r) => ({ state: r.state!, city: r.city! }))
}

/** Top 10 states by vaga count. */
export async function fetchStateCounts(): Promise<{ state: string; count: number }[]> {
  const rows = await db
    .select({
      state: vagasPublic.state,
      count: count(),
    })
    .from(vagasPublic)
    .where(isNotNull(vagasPublic.state))
    .groupBy(vagasPublic.state)
    .orderBy(desc(count()))
    .limit(10)

  return rows.map((r) => ({
    state: r.state!,
    count: r.count,
  }))
}
