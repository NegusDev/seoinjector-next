# @negusdev/seoinjector-next

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![npm version](https://img.shields.io/npm/v/@negusdev/seoinjector-next.svg?style=flat-square)](https://www.npmjs.com/package/@negusdev/seoinjector-next)

Next.js SEO integration for SEO Injector.

Fetch and inject SEO metadata — title, description, Open Graph, Twitter, hreflang, and canonical — into your Next.js App Router pages via a simple API-first interface. Designed for server-side use only, so API keys stay off the client at all times.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Background

Managing SEO metadata across a large Next.js application is repetitive and error-prone. This package offloads that work to SEO Injector — a centralised metadata management service — and maps its API responses directly to the `Metadata` object expected by Next.js App Router's `generateMetadata` convention.

It handles Open Graph, Twitter Cards, hreflang alternate links, canonical URLs, and JSON-LD schema out of the box, with safe fallback behaviour when the API is unavailable.

## Install

Requires **Next.js 14+** (App Router), **Node.js 18+**.

```bash
npm install @negusdev/seoinjector-next
```

Add the following to your `.env` file:

```env
SEOINJECTOR_SITE_ID=your-site-id
SEOINJECTOR_API_URL=https://api.seoinjector.com/api
```

## Usage

### Basic

```ts
import type { Metadata } from 'next'
import { generateSEOMetadata } from '@negusdev/seoinjector-next'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    pathname: '/about',
    locale: 'en-US',
    siteId: process.env.SEOINJECTOR_SITE_ID!,
    apiBaseUrl: process.env.SEOINJECTOR_API_URL!,
  })
}

export default function Page() {
  return <div>About page</div>
}
```

### Dynamic Routes

```ts
import type { Metadata } from 'next'
import { generateSEOMetadata } from '@negusdev/seoinjector-next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  return generateSEOMetadata({
    pathname: `/blog/${slug}`,
    locale: 'en-US',
    siteId: process.env.SEOINJECTOR_SITE_ID!,
    apiBaseUrl: process.env.SEOINJECTOR_API_URL!,
  })
}
```

### Fallback Metadata

Provide fallback values used when SEO data is missing or the API call fails:

```ts
return generateSEOMetadata({
  pathname: '/pricing',
  locale: 'en-US',
  siteId: process.env.SEOINJECTOR_SITE_ID!,
  apiBaseUrl: process.env.SEOINJECTOR_API_URL!,
  fallback: {
    title: 'Pricing',
    description: 'Our pricing plans',
  },
})
```

### JSON-LD (Schema)

Next.js does not expose JSON-LD through its `Metadata` API. Use `getSchemaJson` alongside `fetchSEOData` to inject it manually:

```tsx
import { fetchSEOData, getSchemaJson } from '@negusdev/seoinjector-next'

export default async function Page() {
  const data = await fetchSEOData({
    pathname: '/product/1',
    locale: 'en-US',
    siteId: process.env.SEOINJECTOR_SITE_ID!,
    apiBaseUrl: process.env.SEOINJECTOR_API_URL!,
  })

  const schema = getSchemaJson(data)

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      )}
      <div>Product page</div>
    </>
  )
}
```

### Manual Fetch + Mapping

For cases where you need direct access to the raw API response:

```ts
import {
  fetchSEOData,
  mapApiResponseToMetadata,
} from '@negusdev/seoinjector-next'

const data = await fetchSEOData({
  pathname: '/about',
  locale: 'en-US',
  siteId: process.env.SEOINJECTOR_SITE_ID!,
  apiBaseUrl: process.env.SEOINJECTOR_API_URL!,
})

const metadata = mapApiResponseToMetadata(data)
```

## API

### `generateSEOMetadata(options)`

High-level helper covering most use cases. Fetches SEO data and returns a Next.js `Metadata` object. Returns `{}` safely if the API call fails.

```ts
generateSEOMetadata(options: GenerateSEOMetadataOptions): Promise<Metadata>
```

### `fetchSEOData(options)`

Fetches raw SEO data from the SEO Injector API. Returns `null` on failure.

```ts
fetchSEOData(options: FetchSEODataOptions): Promise<SEOInjectorApiResponse | null>
```

### `mapApiResponseToMetadata(data)`

Converts an `SEOInjectorApiResponse` into a Next.js `Metadata` object. Handles OG → standard meta and Twitter → OG fallback chains automatically.

```ts
mapApiResponseToMetadata(data: SEOInjectorApiResponse | null): Metadata
```

### `getSchemaJson(data)`

Extracts a serialised JSON-LD string from the API response, ready for use in a `<script type="application/ld+json">` tag.

```ts
getSchemaJson(data: SEOInjectorApiResponse | null): string | null
```

### Options

```ts
type GenerateSEOMetadataOptions = {
  pathname: string             // Required. The page path (e.g. '/about')
  locale?: string              // BCP 47 locale tag (e.g. 'en-US')
  siteId: string               // Your SEO Injector site ID
  apiKey?: string              // Optional API key
  apiBaseUrl: string           // Base URL for the SEO Injector API
  timeoutMs?: number           // Request timeout in milliseconds
  revalidate?: number | false  // Next.js revalidation interval
  fallback?: Metadata          // Fallback metadata if the API fails
}
```

### Behaviour

- Returns `{}` if the API fails — safe by default, no thrown errors
- Fallback chain: OG → standard meta → fallback value
- Fallback chain: Twitter → OG → standard meta → fallback value
- Uses canonical URL when OG URL is missing
- Splits comma-separated keyword strings into arrays

## Maintainers

[@negusdev](https://github.com/negusdev)

## Contributing

Questions and issues are welcome — please [open an issue](https://github.com/negusdev/seoinjector-next/issues).

PRs are accepted. Please ensure your changes are consistent with the existing code style and that any new behaviour is covered by tests before submitting.

## License

MIT © SEO Injector