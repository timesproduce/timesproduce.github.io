<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Content, useData, useRoute, useRouter, withBase } from 'vitepress'
import site from '../site.json'
import { useHref, useUi } from './ui'
import { track } from './track'

const route = useRoute()
const router = useRouter()
const { site: vpSite, localeIndex } = useData()
const ui = useUi()
const href = useHref()
const open = ref(false)
const closeBtn = ref<HTMLButtonElement | null>(null)
const burgerBtn = ref<HTMLButtonElement | null>(null)
// Page path without the site base and without the language prefix (/es/grow -> /grow).
const rel = computed(() => {
  let p = route.path
  const b = vpSite.value.base
  if (b !== '/' && p.startsWith(b)) p = '/' + p.slice(b.length)
  return p
})
const unprefixed = computed(() => rel.value.replace(/^\/(es|zh|ko|ja)(?=\/|$)/, '') || '/')
const current = computed(() => unprefixed.value.replace(/(\.html|\/index)?$/, '').replace(/\/$/, '') || '/')
const isActive = (href: string) => current.value === href

function setOpen(v: boolean) {
  open.value = v
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) nextTick(() => closeBtn.value?.focus())
  else burgerBtn.value?.focus()
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) setOpen(false)
}
watch(() => route.path, () => { open.value = false; document.body.style.overflow = '' })
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' })

const links = computed(() => [
  { text: ui.value.nav.home, href: '/' },
  { text: ui.value.nav.services, href: '/services' },
  { text: ui.value.nav.grow, href: '/grow' },
  { text: ui.value.nav.contact, href: '/contact' }
])
// 'suggest' and 'dismiss' are written in the language they offer, for the banner.
const languages = [
  { id: 'root', label: 'English', code: 'en', suggest: 'View this page in English', dismiss: 'Dismiss' },
  { id: 'es', label: 'Español', code: 'es', suggest: 'Ver esta página en español', dismiss: 'Cerrar' },
  { id: 'zh', label: '繁體中文', code: 'zh-Hant', suggest: '以繁體中文檢視此頁', dismiss: '關閉' },
  { id: 'ko', label: '한국어', code: 'ko', suggest: '이 페이지를 한국어로 보기', dismiss: '닫기' },
  { id: 'ja', label: '日本語', code: 'ja', suggest: 'このページを日本語で見る', dismiss: '閉じる' }
]
const currentLabel = computed(() => languages.find((l) => l.id === localeIndex.value)?.label ?? 'English')
const pathFor = (id: string) => withBase((id === 'root' ? '' : `/${id}`) + unprefixed.value)
function switchLanguage(e: Event) {
  const id = (e.target as HTMLSelectElement).value
  try { localStorage.setItem('lang', id) } catch {}
  router.go(pathFor(id))
}
function rememberLanguage(id: string) {
  try { localStorage.setItem('lang', id) } catch {}
}

// Suggest the visitor's browser language once. Client-only, so it never appears
// in the server-rendered HTML that search engines see.
const mounted = ref(false)
const suggested = ref<(typeof languages)[number] | null>(null)
function dismissBanner() {
  suggested.value = null
  try { localStorage.setItem('langBannerDismissed', '1') } catch {}
}
onMounted(() => {
  mounted.value = true
  try {
    if (localStorage.getItem('lang') || localStorage.getItem('langBannerDismissed')) return
  } catch {}
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split('-')[0]
    const match = languages.find((l) => l.code.split('-')[0] === base)
    if (match) {
      if (match.id !== localeIndex.value) suggested.value = match
      break
    }
  }
})
const onCall = () => track('tel_click', localeIndex.value)
const mapSrc =
  `https://maps.google.com/maps?q=${encodeURIComponent(`${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`)}&z=14&output=embed`
</script>

<template>
  <div class="frame">
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MZVXGQP7" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <div v-if="mounted && suggested" class="lang-banner" :lang="suggested.code">
      <a :href="pathFor(suggested.id)" @click="rememberLanguage(suggested.id)">{{ suggested.suggest }}</a>
      <button type="button" :aria-label="suggested.dismiss" @click="dismissBanner">×</button>
    </div>
    <header class="site-header">
      <a :href="href('/')" class="brand" :aria-label="ui.site.home_aria">
        <img :src="withBase('/images/logo.svg')" alt="" />
      </a>
      <div class="lang">
        <!-- "languages" icon (Lucide, ISC license) -->
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
        </svg>
        <span class="lang-name" aria-hidden="true">{{ currentLabel }}</span>
        <select class="lang-select" :aria-label="ui.site.language" :value="localeIndex" @change="switchLanguage">
          <option v-for="l in languages" :key="l.id" :value="l.id" :lang="l.code">{{ l.label }}</option>
        </select>
      </div>
      <button ref="burgerBtn" class="burger" aria-haspopup="true" :aria-expanded="open" aria-controls="site-menu" @click="setOpen(true)">
        <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
          <path d="M8 13h24M8 20h24M8 27h24" stroke="#1c5443" stroke-width="1.6" fill="none" />
        </svg>
        <span class="sr-only">{{ ui.site.menu }}</span>
      </button>
    </header>

    <Transition name="menu">
      <div v-if="open" id="site-menu" class="menu-overlay" role="dialog" aria-modal="true" :aria-label="ui.site.site_navigation" @click.self="setOpen(false)">
        <button ref="closeBtn" class="burger close" @click="setOpen(false)">
          <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
            <path d="M11 11l18 18M29 11L11 29" stroke="#1c5443" stroke-width="1.6" fill="none" />
          </svg>
          <span class="sr-only">{{ ui.site.close_menu }}</span>
        </button>
        <nav class="menu">
          <a v-for="l in links" :key="l.href" :href="href(l.href)" :aria-current="isActive(l.href) ? 'page' : undefined"
            :class="{ active: isActive(l.href) }" @click="open = false; setOpen(false)">{{ l.text }}</a>
          <a class="menu-phone" :href="`tel:${site.phone_link}`" @click="onCall">{{ site.phone_display }}</a>
          <div class="menu-langs" role="group" :aria-label="ui.site.language">
            <a v-for="l in languages" :key="l.id" :href="pathFor(l.id)" :lang="l.code" :hreflang="l.code"
              :aria-current="l.id === localeIndex ? 'true' : undefined" :class="{ active: l.id === localeIndex }"
              @click="rememberLanguage(l.id)">{{ l.label }}</a>
          </div>
        </nav>
      </div>
    </Transition>

    <main>
      <Content />
    </main>

    <footer class="site-footer">
      <div class="footer-photo" :style="{ backgroundImage: `url(${withBase('/images/produce.jpg')})` }" role="img"
        :aria-label="ui.site.footer_photo_alt" />
      <div class="footer-info">
        <img :src="withBase('/images/clocktower.svg')" alt="Times Produce" class="clock" />
        <div class="addr-row">
          <address>{{ site.address.street }},<br />{{ site.address.city }}<br />{{ site.address.state }}, {{ site.address.zip }}.</address>
          <div class="tel">
            <a :href="`tel:${site.phone_link}`" @click="onCall">{{ ui.site.phone_label }} : {{ site.phone_display }}</a><br />
            {{ ui.site.fax_label }} : {{ site.fax_display }}
            <br /><a :href="href('/grow')">{{ ui.site.footer_grow }}</a> · <a :href="href('/contact')">{{ ui.site.footer_contact }}</a> · <a :href="href('/produce')">{{ ui.nav.produce }}</a>
          </div>
        </div>
        <iframe class="map" :src="mapSrc" :title="ui.site.map_title" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
        <p class="credit">{{ site.credit_text }} <a :href="site.credit_url" target="_blank" rel="noopener">{{ site.credit_name }}</a></p>
      </div>
    </footer>
  </div>
</template>
