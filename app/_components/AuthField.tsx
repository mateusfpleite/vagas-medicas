export function AuthField({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  defaultValue,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
  defaultValue?: string
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-muted">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-md border border-cream-dark bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </label>
  )
}
