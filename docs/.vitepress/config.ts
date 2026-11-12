import { defineConfig } from 'vitepress'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import site from './site.json'

// Canonical site address. Set SITE_URL when the custom domain goes live
// (e.g. SITE_URL=https://www.timesproduce.com) so canonical links, social
// cards and the sitemap point at the right place.
const SITE = (process.env.SITE_URL || 'https://www.timesproduce.com').replace(/\/$/, '')
const BASE = process.env.BASE ?? '/'
const NAME = site.name
const DEFAULT_DESC =
  'Times Produce is a Los Angeles wholesale produce distributor with more than 70 years of experience, shipping fresh fruits and vegetables worldwide.'

export default defineConfig({
  lang: 'en-US',
  title: NAME,
  titleTemplate: ':title | Times Produce',
  description: DEFAULT_DESC,
  base: BASE,
  cleanUrls: true,
  appearance: false,
  lastUpdated: false,
  sitemap: { hostname: SITE + BASE },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${BASE}images/clocktower.png` }],
    ['link', { rel: 'apple-touch-icon', href: `${BASE}images/apple-touch-icon.png` }],
    ['meta', { name: 'theme-color', content: '#1c5443' }],
    ['meta', { property: 'og:site_name', content: NAME }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],

  buildEnd({ outDir }) {
    writeFileSync(join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}${BASE}sitemap.xml\n`)
  },

  transformPageData(pageData) {
    if (pageData.isNotFound) return
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    const url = `${SITE}${BASE}${path}`
    const isHome = pageData.relativePath === 'index.md'
    const title = isHome ? `${NAME} | Wholesale Produce in Los Angeles` : `${pageData.title} | ${NAME}`
    const desc = pageData.frontmatter.description || DEFAULT_DESC
    const image = `${SITE}${BASE}images/og-image.jpg`

    const head: [string, Record<string, string>][] = [
      ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: desc }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:image', content: image }],
      ['meta', { property: 'og:image:width', content: '1200' }],
      ['meta', { property: 'og:image:height', content: '630' }],
      ['meta', { property: 'og:image:alt', content: 'Fresh tomatoes from Times Produce' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: desc }],
      ['meta', { name: 'twitter:image', content: image }]
    ]
    pageData.frontmatter.head = [...(pageData.frontmatter.head ?? []), ...head]
  },

  transformHead({ pageData }) {
    if (pageData.isNotFound) return [['meta', { name: 'robots', content: 'noindex' }]]
    if (pageData.relativePath !== 'index.md') return
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${SITE}${BASE}#business`,
      name: NAME,
      description: DEFAULT_DESC,
      url: `${SITE}${BASE}`,
      logo: `${SITE}${BASE}images/clocktower.png`,
      image: `${SITE}${BASE}images/og-image.jpg`,
      telephone: site.phone_link,
      faxNumber: site.fax_display,
      foundingDate: '1951',
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        addressRegion: site.address.state,
        postalCode: site.address.zip,
        addressCountry: 'US'
      },
      areaServed: 'Worldwide'
    }
    return [['script', { type: 'application/ld+json' }, JSON.stringify(ld)]]
  }
})
