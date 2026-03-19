import type { Metadata } from 'next'
import type { SEOInjectorApiResponse } from './types'
import {
  getAlternateLanguages,
  getCanonicalUrl,
  getMetaTagContent,
  splitKeywords,
} from './utils'

type OpenGraphType =
  | 'website'
  | 'article'
  | 'book'
  | 'profile'
  | 'music.song'
  | 'music.album'
  | 'music.playlist'
  | 'music.radio_station'
  | 'video.movie'
  | 'video.episode'
  | 'video.tv_show'
  | 'video.other'

function toOpenGraphType(value?: string): OpenGraphType {
  const allowed: OpenGraphType[] = [
    'website',
    'article',
    'book',
    'profile',
    'music.song',
    'music.album',
    'music.playlist',
    'music.radio_station',
    'video.movie',
    'video.episode',
    'video.tv_show',
    'video.other',
  ]

  return allowed.includes(value as OpenGraphType)
    ? (value as OpenGraphType)
    : 'website'
}

export function mapApiResponseToMetadata(
  data: SEOInjectorApiResponse | null | undefined
): Metadata {
  if (!data) {
    return {}
  }

  const title = getMetaTagContent(data, 'title') ?? data.page?.title
  const description = getMetaTagContent(data, 'description')
  const author = getMetaTagContent(data, 'author')
  const keywords = splitKeywords(getMetaTagContent(data, 'keywords'))

  const canonical = getCanonicalUrl(data)
  const languages = getAlternateLanguages(data)

  const ogTitle = getMetaTagContent(data, 'og:title') ?? title
  const ogDescription = getMetaTagContent(data, 'og:description') ?? description
  const ogUrl = getMetaTagContent(data, 'og:url') ?? canonical
  const ogImage = getMetaTagContent(data, 'og:image')
  const ogSiteName = getMetaTagContent(data, 'og:site_name') ?? data.website?.name
  const ogType = toOpenGraphType(getMetaTagContent(data, 'og:type'))

  const twitterCard = getMetaTagContent(data, 'twitter:card') as
    | 'summary'
    | 'summary_large_image'
    | 'player'
    | 'app'
    | undefined

  const twitterTitle = getMetaTagContent(data, 'twitter:title') ?? title
  const twitterDescription =
    getMetaTagContent(data, 'twitter:description') ?? description
  const twitterImage = getMetaTagContent(data, 'twitter:image') ?? ogImage
  const twitterSite = getMetaTagContent(data, 'twitter:site')

  return {
    title,
    description,
    keywords,
    authors: author ? [{ name: author }] : undefined,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,
      siteName: ogSiteName,
      type: ogType,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
      site: twitterSite,
    },
  }
}