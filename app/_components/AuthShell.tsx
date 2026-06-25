export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <h1 className="font-[family-name:var(--font-serif)] text-2xl text-ink">{title}</h1>
      {subtitle && <p className="mt-1 mb-6 text-sm text-ink-muted">{subtitle}</p>}
      {children}
    </div>
  )
}
