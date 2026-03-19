import type { SEOInjectorApiResponse } from './types'

export function getSchemaJson(
  data: SEOInjectorApiResponse | null | undefined
): string | null {
  if (!data?.schemaJson) {
    return null
  }

  return typeof data.schemaJson === 'string'
    ? data.schemaJson
    : JSON.stringify(data.schemaJson)
}