import { describe, expect, it } from 'vitest'
import {
  getAlternateLanguages,
  getCanonicalUrl,
  getMetaTagContent,
  splitKeywords
} from '../src/utils'
import type { SEOInjectorApiResponse } from '../src/types'

const payload: SEOInjectorApiResponse = {
  metaTags: [
    { name: 'title', content: 'Page Title' },
    { property: 'og:title', content: 'OG Title' },
    { name: 'keywords', content: 'seo,nextjs,metadata' }
  ],
  hreflangTags: [
    { rel: 'alternate', hreflang: 'en-US', href: 'https://example.com/en' },
    { rel: 'alternate', hreflang: 'fr-FR', href: 'https://example.com/fr' },
    { rel: 'canonical', href: 'https://example.com/en' }
  ],
  schemaJson: null
}

describe('utils', () => {
  it('gets meta tag content by name', () => {
    expect(getMetaTagContent(payload, 'title')).toBe('Page Title')
  })

  it('gets meta tag content by property', () => {
    expect(getMetaTagContent(payload, 'og:title')).toBe('OG Title')
  })

  it('gets canonical url', () => {
    expect(getCanonicalUrl(payload)).toBe('https://example.com/en')
  })

  it('gets alternate languages', () => {
    expect(getAlternateLanguages(payload)).toEqual({
      'en-US': 'https://example.com/en',
      'fr-FR': 'https://example.com/fr'
    })
  })

  it('splits comma-separated keywords', () => {
    expect(splitKeywords('seo,nextjs,metadata')).toEqual([
      'seo',
      'nextjs',
      'metadata'
    ])
  })

  it('returns undefined for empty keywords', () => {
    expect(splitKeywords('')).toBeUndefined()
  })
})