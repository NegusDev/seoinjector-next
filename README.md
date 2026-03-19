# @negusdev/seoinjector-next

Next.js SEO integration for SEO Injector.

Fetch and inject SEO metadata (title, description, Open Graph, Twitter, hreflang, canonical) into your Next.js App Router using a simple API.

---

## Features

* Works with **Next.js App Router**
* Supports **dynamic routes**
* Handles **Open Graph & Twitter metadata**
* Supports **hreflang & canonical URLs**
* Built-in **fallback handling**
* Optional **JSON-LD (schema) support**
* Minimal setup, API-first design

---

## Installation

```bash
npm install @negusdev/seoinjector-next
```

---

## Environment Setup

```env
SEOINJECTOR_SITE_ID=your-site-id
SEOINJECTOR_API_URL=https://api.seoinjector.com/api
```

---

## Quick Start

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

---

## Dynamic Routes

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

---

## Fallback Metadata

Use fallback values when SEO data is missing or API fails.

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

---

## Advanced Usage

### Manual Fetch + Mapping

```ts
import {
  fetchSEOData,
  mapApiResponseToMetadata
} from '@negusdev/seoinjector-next'

const data = await fetchSEOData({
  pathname: '/about',
  locale: 'en-US',
  siteId: process.env.SEOINJECTOR_SITE_ID!,
  apiBaseUrl: process.env.SEOINJECTOR_API_URL!,
})

const metadata = mapApiResponseToMetadata(data)
```

---

## JSON-LD (Schema Support)

Next.js does not include JSON-LD in its Metadata API. Use the helper below.

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

---

## API

### `generateSEOMetadata(options)`

High-level helper for most use cases.

```ts
generateSEOMetadata(options: GenerateSEOMetadataOptions): Promise<Metadata>
```

---

### `fetchSEOData(options)`

Fetch raw SEO data from the SEO Injector API.

```ts
fetchSEOData(options: FetchSEODataOptions): Promise<SEOInjectorApiResponse | null>
```

---

### `mapApiResponseToMetadata(data)`

Convert API response into Next.js `Metadata`.

```ts
mapApiResponseToMetadata(data): Metadata
```

---

### `getSchemaJson(data)`

Extract JSON-LD schema.

```ts
getSchemaJson(data): string | null
```

---

## Options

```ts
type GenerateSEOMetadataOptions = {
  pathname: string
  locale?: string
  siteId: string
  apiKey?: string
  apiBaseUrl: string
  timeoutMs?: number
  revalidate?: number | false
  fallback?: Metadata
}
```

---

## Behavior

* Returns `{}` if API fails (safe by default)
* Falls back automatically:

  * OG → standard meta
  * Twitter → OG or standard meta
* Uses canonical URL when OG URL is missing
* Splits keywords into array when comma-separated

---

## Requirements

* Next.js 14+
* App Router (`app/` directory)
* Node.js 18+

---

## Notes

* Designed for **server-side usage only** (`generateMetadata`)
* API keys are never exposed to the client
* Works with any deployment (Vercel, Node, Docker, etc.)

---

## Roadmap

* JSON-LD React component
* Pages Router support
* Edge runtime optimization
* Plugin integrations (CMS, headless setups)

---

## License

MIT

---

## Author

SEO Injector
