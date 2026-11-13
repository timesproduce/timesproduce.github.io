// Sends simple events to Google Tag Manager (dataLayer), tagged with the page language.
export function track(event: string, locale: string, extra: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: unknown[] }
  ;(w.dataLayer = w.dataLayer || []).push({ event, locale, ...extra })
}
