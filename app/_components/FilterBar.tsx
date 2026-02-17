'use client'

import { useEffect, useRef, useState } from 'react'
import { Combobox } from './Combobox'
import { MultiCombobox } from './MultiCombobox'
import { StateCombobox } from './StateCombobox'

type Props = {
  specialties: string[]
  cities: string[]
  states: string[]
  specialty: string | null
  city: string[]
  state: string | null
  q: string
  onSpecialtyChange: (v: string | null) => void
  onCityChange: (v: string[]) => void
  onStateChange: (v: string | null) => void
  onSearchChange: (v: string) => void
}

export function FilterBar({
  specialties,
  cities,
  states,
  specialty,
  city,
  state,
  q,
  onSpecialtyChange,
  onCityChange,
  onStateChange,
  onSearchChange,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' },
    )

    const sentinel = document.createElement('div')
    sentinel.style.height = '1px'
    el.parentElement?.insertBefore(sentinel, el)
    observer.observe(sentinel)

    return () => {
      observer.disconnect()
      sentinel.remove()
    }
  }, [])

  function handleSearch(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onSearchChange(value), 300)
  }

  return (
    <div
      ref={ref}
      data-stuck={stuck}
      className="filter-bar-sticky sticky top-0 z-10 -mx-6 px-6 py-4"
    >
      <div className="rounded-xl border border-cream-dark/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="w-full sm:w-44">
            <Combobox
              label="Especialidade"
              options={specialties}
              value={specialty}
              onChange={onSpecialtyChange}
              placeholder="Todas"
            />
          </div>
          <div className="w-full sm:w-40">
            <StateCombobox
              value={state}
              onChange={onStateChange}
              availableStates={states}
            />
          </div>
          <div className="w-full sm:w-44">
            <MultiCombobox
              label="Cidade"
              options={cities}
              value={city}
              onChange={onCityChange}
              placeholder="Todas"
            />
          </div>
          <div className="w-full sm:flex-1">
            <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wider text-ink-muted">
              Buscar
            </label>
            <input
              type="text"
              defaultValue={q}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar no titulo..."
              className="w-full rounded-lg border border-cream-dark bg-white py-2.5 pl-3.5 pr-4 text-sm text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
