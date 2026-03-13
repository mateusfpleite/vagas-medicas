import type { MetadataRoute } from 'next'
import { fetchAllSpecialties, fetchAllStates, fetchAllStateCityPairs } from '@/lib/queries'
import { toSlug } from '@/lib/slugs'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://empregamed.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [specialties, states, cityPairs] = await Promise.all([
    fetchAllSpecialties(),
    fetchAllStates(),
    fetchAllStateCityPairs(),
  ])

  const now = new Date()

  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/sobre`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Specialty pages
  for (const s of specialties) {
    entries.push({
      url: `${BASE_URL}/especialidade/${toSlug(s)}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    })
  }

  // State pages
  for (const st of states) {
    entries.push({
      url: `${BASE_URL}/estado/${st.toLowerCase()}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    })
  }

  // City pages (from single query)
  for (const { state, city } of cityPairs) {
    entries.push({
      url: `${BASE_URL}/estado/${state.toLowerCase()}/${toSlug(city)}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.6,
    })
  }

  // Specialty + state combinations
  for (const s of specialties) {
    for (const st of states) {
      entries.push({
        url: `${BASE_URL}/especialidade/${toSlug(s)}/${st.toLowerCase()}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.6,
      })
    }
  }

  return entries
}
