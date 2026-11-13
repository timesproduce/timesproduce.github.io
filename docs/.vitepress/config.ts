import { defineConfig } from 'vitepress'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import site from './site.json'

// Canonical site address. Set SITE_URL when the custom domain goes live
// (e.g. SITE_URL=https://timesproduce.com, matching the CNAME file) so canonical links, social
// cards and the sitemap point at the right place.
const SITE = (process.env.SITE_URL || 'https://timesproduce.com').replace(/\/$/, '')
const BASE = process.env.BASE ?? '/'
const NAME = site.name
const GTM_ID = 'GTM-MZVXGQP7'
// Languages on the site. 'dir' is the folder under docs/ (root = English).
// 'hreflang' and 'ogLocale' must match what search engines and Facebook expect.
const LOCALES = [
  { key: 'root', dir: '', label: 'English', lang: 'en-US', hreflang: 'en-US', ogLocale: 'en_US' },
  { key: 'es', dir: 'es', label: 'Español', lang: 'es', hreflang: 'es', ogLocale: 'es_US' },
  { key: 'zh', dir: 'zh', label: '繁體中文', lang: 'zh-Hant', hreflang: 'zh-Hant', ogLocale: 'zh_TW' },
  { key: 'ko', dir: 'ko', label: '한국어', lang: 'ko', hreflang: 'ko', ogLocale: 'ko_KR' },
  { key: 'ja', dir: 'ja', label: '日本語', lang: 'ja', hreflang: 'ja', ogLocale: 'ja_JP' }
]
// Languages our phone staff actually speak (used in structured data).
const PHONE_LANGUAGES = ['English', 'Spanish', 'Japanese']
const DEFAULT_DESC =
  'Times Produce is a Los Angeles wholesale produce distributor with more than 70 years of experience, shipping fresh fruits and vegetables worldwide.'

function localeOf(relativePath: string) {
  const first = relativePath.split('/')[0]
  return LOCALES.find((l) => l.dir && l.dir === first) ?? LOCALES[0]
}

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

  locales: Object.fromEntries(
    LOCALES.map((l) => [l.key, { label: l.label, lang: l.lang, ...(l.dir ? { link: `/${l.dir}/` } : {}) }])
  ),

  head: [
    [
      'script',
      {},
      `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`
    ],
    ['link', { rel: 'icon', type: 'image/png', href: `${BASE}images/clocktower.png` }],
    ['link', { rel: 'apple-touch-icon', href: `${BASE}images/apple-touch-icon.png` }],
    ['meta', { name: 'theme-color', content: '#1c5443' }],
    ['meta', { property: 'og:site_name', content: NAME }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],

  buildEnd({ outDir }) {
    writeFileSync(join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}${BASE}sitemap.xml\n`)
  },

  transformPageData(pageData) {
    if (pageData.isNotFound) return
    const loc = localeOf(pageData.relativePath)
    const inner = pageData.relativePath.replace(/^(es|zh|ko|ja)\//, '')
    const pathFor = (dir: string) =>
      (dir ? `${dir}/` : '') + inner.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    const url = `${SITE}${BASE}${pathFor(loc.dir)}`
    const isHome = inner === 'index.md'
    const title = isHome ? `${NAME} | ${pageData.title}` : `${pageData.title} | ${NAME}`
    const desc = pageData.frontmatter.description || DEFAULT_DESC
    const image = `${SITE}${BASE}images/og-image.jpg`

    const head: [string, Record<string, string>][] = [
      ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:locale', content: loc.ogLocale }],
      ...LOCALES.map((l): [string, Record<string, string>] => [
        'link',
        { rel: 'alternate', hreflang: l.hreflang, href: `${SITE}${BASE}${pathFor(l.dir)}` }
      ]),
      ['link', { rel: 'alternate', hreflang: 'x-default', href: `${SITE}${BASE}${pathFor('')}` }],
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
    const loc = localeOf(pageData.relativePath)
    if (pageData.relativePath.replace(/^(es|zh|ko|ja)\//, '') !== 'index.md') return
    const pageDesc = pageData.frontmatter.description || DEFAULT_DESC
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WholesaleStore',
      '@id': `${SITE}${BASE}#business`,
      inLanguage: loc.hreflang,
      name: NAME,
      description: pageDesc,
      hasMap: `https://maps.google.com/maps?q=${encodeURIComponent(`${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`)}`,
      url: `${SITE}${BASE}${loc.dir ? loc.dir + '/' : ''}`,
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
      areaServed: [
        { '@type': 'City', name: 'Los Angeles' },
        { '@type': 'AdministrativeArea', name: 'Los Angeles County' },
        { '@type': 'AdministrativeArea', name: 'Southern California' },
        { '@type': 'State', name: 'California' },
        'Worldwide'
      ],
      contactPoint: [
        { '@type': 'ContactPoint', contactType: 'sales', telephone: site.phone_link, availableLanguage: PHONE_LANGUAGES },
        { '@type': 'ContactPoint', contactType: 'supplier relations', telephone: site.phone_link, availableLanguage: PHONE_LANGUAGES }
      ]
    }
    return [['script', { type: 'application/ld+json' }, JSON.stringify(ld)]]
  }
})
