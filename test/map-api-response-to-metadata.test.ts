import { describe, expect, it } from 'vitest'
import { mapApiResponseToMetadata } from '../src/map-api-response-to-metadata'
import type { SEOInjectorApiResponse } from '../src/types'

const sampleApiResponse: SEOInjectorApiResponse = {
  metaTags: [
    {
      name: 'title',
      content: 'testament'
    },
    {
      name: 'description',
      content: 'fflfdklf fdkfdkfdkdfk'
    },
    {
      name: 'author',
      content: 'negus'
    },
    {
      name: 'keywords',
      content: 'kdsklskl dkldsklsd jkdskldsklds'
    },
    {
      property: 'og:site_name',
      content: null
    },
    {
      property: 'og:title',
      content: null
    },
    {
      property: 'og:description',
      content: null
    },
    {
      property: 'og:url',
      content: null
    },
    {
      property: 'og:image',
      content: null
    },
    {
      property: 'og:type',
      content: null
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: null
    },
    {
      name: 'twitter:description',
      content: null
    },
    {
      name: 'twitter:image',
      content: null
    },
    {
      name: 'twitter:site',
      content: null
    }
  ],
  hreflangTags: [
    {
      rel: 'alternate',
      hreflang: 'en-US',
      href: 'http://localhost/eschool-manager-website/testament'
    },
    {
      rel: 'alternate',
      hreflang: 'es-MX',
      href: 'http://localhost/eschool-manager-website/es-MX/testament'
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: 'http://localhost/eschool-manager-website/testament'
    },
    {
      rel: 'canonical',
      href: 'http://localhost/eschool-manager-website/testament'
    }
  ],
  schemaJson: null,
  page: {
    id: 91,
    url: '/testament',
    title: 'testament',
    locale: 'en',
    is_master: true
  },
  website: {
    id: 2,
    name: 'eSchool Manager',
    domain: 'http://localhost/eschool-manager-website/'
  },
  requested_locale: {
    fullLocale: 'en-US',
    language: 'en',
    region: 'US'
  },
  resolved_locale: {
    language: 'en',
    region: 'US'
  },
  cached_at: '2026-02-08T22:04:01+00:00'
}

describe('mapApiResponseToMetadata', () => {
  it('maps standard meta tags into Next.js metadata', () => {
    const metadata = mapApiResponseToMetadata(sampleApiResponse)

    expect(metadata.title).toBe('testament')
    expect(metadata.description).toBe('fflfdklf fdkfdkfdkdfk')
    expect(metadata.authors).toEqual([{ name: 'negus' }])
    expect(metadata.keywords).toEqual(['kdsklskl dkldsklsd jkdskldsklds'])
  })

  it('maps canonical and hreflang alternates', () => {
    const metadata = mapApiResponseToMetadata(sampleApiResponse)

    expect(metadata.alternates?.canonical).toBe(
      'http://localhost/eschool-manager-website/testament'
    )

    expect(metadata.alternates?.languages).toEqual({
      'en-US': 'http://localhost/eschool-manager-website/testament',
      'es-MX': 'http://localhost/eschool-manager-website/es-MX/testament',
      'x-default': 'http://localhost/eschool-manager-website/testament'
    })
  })

  it('falls back open graph values from standard metadata when OG tags are null', () => {
    const metadata = mapApiResponseToMetadata(sampleApiResponse)

    expect(metadata.openGraph).toMatchObject({
      title: 'testament',
      description: 'fflfdklf fdkfdkfdkdfk',
      url: 'http://localhost/eschool-manager-website/testament',
      siteName: 'eSchool Manager',
      type: 'website'
    })

    expect(metadata.openGraph?.images).toBeUndefined()
  })

  it('falls back twitter values from standard metadata when twitter tags are null', () => {
    const metadata = mapApiResponseToMetadata(sampleApiResponse)

    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'testament',
      description: 'fflfdklf fdkfdkfdkdfk',
      site: undefined
    })

    expect(metadata.twitter?.images).toBeUndefined()
  })

  it('returns an empty object when input is null', () => {
    expect(mapApiResponseToMetadata(null)).toEqual({})
  })

  it('uses page title as fallback when meta title is missing', () => {
    const payload: SEOInjectorApiResponse = {
      ...sampleApiResponse,
      metaTags: sampleApiResponse.metaTags.filter((tag) => tag.name !== 'title')
    }

    const metadata = mapApiResponseToMetadata(payload)

    expect(metadata.title).toBe('testament')
  })

  it('uses OG-specific values when provided', () => {
    const payload: SEOInjectorApiResponse = {
      ...sampleApiResponse,
      metaTags: sampleApiResponse.metaTags.map((tag) => {
        if (tag.property === 'og:title') {
          return { ...tag, content: 'Custom OG Title' }
        }

        if (tag.property === 'og:description') {
          return { ...tag, content: 'Custom OG Description' }
        }

        if (tag.property === 'og:url') {
          return { ...tag, content: 'https://example.com/custom-og-url' }
        }

        if (tag.property === 'og:image') {
          return { ...tag, content: 'https://example.com/og-image.jpg' }
        }

        if (tag.property === 'og:type') {
          return { ...tag, content: 'article' }
        }

        if (tag.property === 'og:site_name') {
          return { ...tag, content: 'Custom Site Name' }
        }

        return tag
      })
    }

    const metadata = mapApiResponseToMetadata(payload)

    expect(metadata.openGraph).toMatchObject({
      title: 'Custom OG Title',
      description: 'Custom OG Description',
      url: 'https://example.com/custom-og-url',
      siteName: 'Custom Site Name',
      type: 'article'
    })

    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://example.com/og-image.jpg'
      }
    ])
  })

  it('uses twitter-specific values when provided', () => {
    const payload: SEOInjectorApiResponse = {
      ...sampleApiResponse,
      metaTags: sampleApiResponse.metaTags.map((tag) => {
        if (tag.name === 'twitter:title') {
          return { ...tag, content: 'Custom Twitter Title' }
        }

        if (tag.name === 'twitter:description') {
          return { ...tag, content: 'Custom Twitter Description' }
        }

        if (tag.name === 'twitter:image') {
          return { ...tag, content: 'https://example.com/twitter-image.jpg' }
        }

        if (tag.name === 'twitter:site') {
          return { ...tag, content: '@seoinjector' }
        }

        return tag
      })
    }

    const metadata = mapApiResponseToMetadata(payload)

    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Custom Twitter Title',
      description: 'Custom Twitter Description',
      site: '@seoinjector',
      images: ['https://example.com/twitter-image.jpg']
    })
  })

  it('falls back twitter image to og:image when twitter:image is missing', () => {
    const payload: SEOInjectorApiResponse = {
      ...sampleApiResponse,
      metaTags: sampleApiResponse.metaTags.map((tag) => {
        if (tag.property === 'og:image') {
          return { ...tag, content: 'https://example.com/og-image.jpg' }
        }

        if (tag.name === 'twitter:image') {
          return { ...tag, content: null }
        }

        return tag
      })
    }

    const metadata = mapApiResponseToMetadata(payload)

    expect(metadata.twitter?.images).toEqual([
      'https://example.com/og-image.jpg'
    ])
  })

  it('returns undefined keywords when keywords tag is missing', () => {
    const payload: SEOInjectorApiResponse = {
      ...sampleApiResponse,
      metaTags: sampleApiResponse.metaTags.filter((tag) => tag.name !== 'keywords')
    }

    const metadata = mapApiResponseToMetadata(payload)

    expect(metadata.keywords).toBeUndefined()
  })
})