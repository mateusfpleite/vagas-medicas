'use client'

import { useState } from 'react'
import {
  Combobox as HeadlessCombobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'

type Props = {
  label: string
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export function MultiCombobox({
  label,
  options,
  value,
  onChange,
  placeholder,
}: Props) {
  const [query, setQuery] = useState('')

  const filtered =
    query === ''
      ? options
      : options.filter((o) =>
          o.toLowerCase().includes(query.toLowerCase()),
        )

  return (
    <HeadlessCombobox
      multiple
      value={value}
      onChange={(val) => {
        onChange(val)
        setQuery('')
      }}
      onClose={() => setQuery('')}
    >
      <div className="relative">
        <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wider text-ink-muted">
          {label}
        </label>

        {value.length > 0 && (
          <div className="mb-1.5 flex flex-wrap gap-1">
            {value.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 rounded-md bg-primary-light px-2 py-0.5 text-xs font-medium text-primary"
              >
                {v}
                <button
                  type="button"
                  className="cursor-pointer text-primary/50 transition-colors hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange(value.filter((c) => c !== v))
                  }}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="relative">
          <ComboboxInput
            className="w-full rounded-lg border border-cream-dark bg-white py-2.5 pl-3.5 pr-16 text-sm text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
            onChange={(e) => setQuery(e.target.value)}
            displayValue={() => query}
            placeholder={value.length > 0 ? 'Adicionar cidade...' : placeholder}
          />
          {value.length > 0 && (
            <button
              type="button"
              className="absolute inset-y-0 right-8 flex cursor-pointer items-center px-1.5 text-ink-muted/50 transition-colors hover:text-ink-muted"
              onClick={(e) => {
                e.stopPropagation()
                onChange([])
                setQuery('')
              }}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <ComboboxButton className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-ink-muted/40">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
          </ComboboxButton>
        </div>
        <ComboboxOptions className="absolute z-20 mt-1.5 max-h-60 w-full overflow-auto rounded-lg border border-cream-dark bg-white py-1 text-sm shadow-lg shadow-ink/5">
          {filtered.length === 0 ? (
            <div className="px-3.5 py-2.5 text-ink-muted">
              Nenhum resultado
            </div>
          ) : (
            filtered.map((option) => (
              <ComboboxOption
                key={option}
                value={option}
                className="cursor-pointer select-none px-3.5 py-2 text-ink-light transition-colors data-[focus]:bg-primary-light data-[focus]:text-primary-dark data-[selected]:font-medium"
              >
                {option}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </div>
    </HeadlessCombobox>
  )
}
