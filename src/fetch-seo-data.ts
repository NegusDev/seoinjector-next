import type { FetchSEODataOptions, SEOInjectorApiResponse } from './types'

function normalizeBaseUrl(apiBaseUrl: string): string {
  return apiBaseUrl.endsWith('/') ? apiBaseUrl : `${apiBaseUrl}/`
}

function buildUrl(options: FetchSEODataOptions): string {
  const base = normalizeBaseUrl(options.apiBaseUrl)
  const url = new URL(`meta/${encodeURIComponent(options.siteId)}`, base)

  url.searchParams.set('url', options.pathname)

  return url.toString()
}

export async function fetchSEOData(
  options: FetchSEODataOptions
): Promise<SEOInjectorApiResponse | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 5000)

  try {
    const response = await fetch(buildUrl(options), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.locale ? { 'Accept-Language': options.locale } : {}),
      },
      signal: controller.signal,
      ...(options.revalidate === false
        ? { cache: 'no-store' as const }
        : {
            next: {
              revalidate: options.revalidate ?? 3600,
            },
          }),
      ...options.fetchOptions,
    })

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as SEOInjectorApiResponse

    if (!data || !Array.isArray(data.metaTags) || !Array.isArray(data.hreflangTags)) {
      return null
    }

    return data
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}