import type { Metadata } from 'next'
import type { GenerateSEOMetadataOptions } from './types'
import { fetchSEOData } from './fetch-seo-data'
import { mapApiResponseToMetadata } from './map-api-response-to-metadata'

export async function generateSEOMetadata(
  options: GenerateSEOMetadataOptions
): Promise<Metadata> {
  const data = await fetchSEOData(options)

  if (!data) {
    return options.fallback ?? {}
  }

  const metadata = mapApiResponseToMetadata(data)

  return {
    ...options.fallback,
    ...metadata,
    alternates: {
      ...options.fallback?.alternates,
      ...metadata.alternates,
    },
    openGraph: {
      ...options.fallback?.openGraph,
      ...metadata.openGraph,
    },
    twitter: {
      ...options.fallback?.twitter,
      ...metadata.twitter,
    },
    // robots: {
    //   ...options.fallback?.robots,
    //   ...metadata.robots,
    // },
  }
}