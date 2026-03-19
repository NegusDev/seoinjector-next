import type { SEOInjectorApiResponse } from './types'

export function getMetaTagContent(
  data: SEOInjectorApiResponse,
  key: string
): string | undefined {
  const tag = data.metaTags.find(
    (item) =>
      (item.name === key || item.property === key) &&
      item.content !== null &&
      item.content !== ''
  )

  return tag?.content ?? undefined
}

export function getCanonicalUrl(
  data: SEOInjectorApiResponse
): string | undefined {
  return data.hreflangTags.find((tag) => tag.rel === 'canonical')?.href
}

export function getAlternateLanguages(
  data: SEOInjectorApiResponse
): Record<string, string> | undefined {
  const result: Record<string, string> = {}

  for (const tag of data.hreflangTags) {
    if (tag.rel !== 'alternate' || !tag.hreflang || !tag.href) {
      continue
    }

    result[tag.hreflang] = tag.href
  }

  return Object.keys(result).length > 0 ? result : undefined
}

export function splitKeywords(value?: string): string[] | undefined {
  if (!value) return undefined

  const parts = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return parts.length > 0 ? parts : undefined
}