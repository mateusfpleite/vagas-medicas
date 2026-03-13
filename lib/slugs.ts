/**
 * Convert a specialty name to a URL slug.
 * "Clinica Geral" -> "clinica-geral"
 * "Medicina do Trabalho" -> "medicina-do-trabalho"
 */
export function toSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Convert a URL slug back to display text.
 * "clinica-geral" -> "Clinica Geral"
 * Note: This is a best-effort reversal. Accents are lost.
 */
export function fromSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
