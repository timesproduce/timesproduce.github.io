// Sends simple events to Google Analytics / Tag Manager, tagged with the page language.
export function track(event: string, locale: string, extra: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void }
  // Tag Manager (if a container listens for it) and Google Analytics 4 (gtag) both get the event.
  ;(w.dataLayer = w.dataLayer || []).push({ event, locale, ...extra })
  if (typeof w.gtag === 'function') w.gtag('event', event, { locale, ...extra })
}
