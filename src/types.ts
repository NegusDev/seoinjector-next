import type { Metadata } from 'next'

export type SEOInjectorApiTag = {
  name?: string
  property?: string
  content: string | null
}

export type SEOInjectorHrefLangTag = {
  rel: string
  hreflang?: string
  href: string
}

export type SEOInjectorApiResponse = {
  metaTags: SEOInjectorApiTag[]
  hreflangTags: SEOInjectorHrefLangTag[]
  schemaJson: string | Record<string, unknown> | null
  page?: {
    id: number
    url: string
    title: string
    locale: string
    is_master: boolean
  }
  website?: {
    id: number
    name: string
    domain: string
  }
  requested_locale?: {
    fullLocale?: string
    language?: string
    region?: string
  }
  resolved_locale?: {
    language?: string
    region?: string
  }
  cached_at?: string
}

export type FetchSEODataOptions = {
  pathname: string
  locale?: string
  siteId: string
  apiKey?: string
  apiBaseUrl: string
  timeoutMs?: number
  revalidate?: number | false
  fetchOptions?: Omit<RequestInit, 'headers'>
}

export type GenerateSEOMetadataOptions = FetchSEODataOptions & {
  fallback?: Metadata
}