<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Content, useRoute, withBase } from 'vitepress'
import site from '../site.json'

const route = useRoute()
const open = ref(false)
const closeBtn = ref<HTMLButtonElement | null>(null)
const burgerBtn = ref<HTMLButtonElement | null>(null)
const current = computed(() => route.path.replace(/(\.html|\/index)?$/, '').replace(/\/$/, '') || '/')
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

const links = [
  { text: 'Home', href: '/' },
  { text: 'Our Services', href: '/services' },
  { text: 'Our Produce', href: '/produce' },
  { text: 'Contact', href: '/contact' }
]
const mapSrc =
  `https://maps.google.com/maps?q=${encodeURIComponent(`${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`)}&z=14&output=embed`
</script>

<template>
  <div class="frame">
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MZVXGQP7" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <header class="site-header">
      <a :href="withBase('/')" class="brand" aria-label="Times Produce home">
        <img :src="withBase('/images/logo.png')" alt="Times Produce — Est. 1951, Los Angeles, CA" />
      </a>
      <button ref="burgerBtn" class="burger" aria-haspopup="true" :aria-expanded="open" aria-controls="site-menu" @click="setOpen(true)">
        <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
          <path d="M8 13h24M8 20h24M8 27h24" stroke="#1c5443" stroke-width="1.6" fill="none" />
        </svg>
        <span class="sr-only">Menu</span>
      </button>
    </header>

    <Transition name="menu">
      <div v-if="open" id="site-menu" class="menu-overlay" role="dialog" aria-modal="true" aria-label="Site navigation" @click.self="setOpen(false)">
        <button ref="closeBtn" class="burger close" @click="setOpen(false)">
          <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
            <path d="M11 11l18 18M29 11L11 29" stroke="#1c5443" stroke-width="1.6" fill="none" />
          </svg>
          <span class="sr-only">Close menu</span>
        </button>
        <nav class="menu">
          <a v-for="l in links" :key="l.href" :href="withBase(l.href)" :aria-current="isActive(l.href) ? 'page' : undefined"
            :class="{ active: isActive(l.href) }" @click="open = false; setOpen(false)">{{ l.text }}</a>
          <a class="menu-phone" :href="`tel:${site.phone_link}`">{{ site.phone_display }}</a>
        </nav>
      </div>
    </Transition>

    <main>
      <Content />
    </main>

    <footer class="site-footer">
      <div class="footer-photo" :style="{ backgroundImage: `url(${withBase('/images/produce.jpg')})` }" role="img"
        aria-label="Historic photo of the Los Angeles produce market" />
      <div class="footer-info">
        <img :src="withBase('/images/clocktower.png')" alt="Times Produce" class="clock" />
        <div class="addr-row">
          <address>{{ site.address.street }},<br />{{ site.address.city }}<br />{{ site.address.state }}, {{ site.address.zip }}.</address>
          <div class="tel">
            <a :href="`tel:${site.phone_link}`">Phone : {{ site.phone_display }}</a><br />
            Fax : {{ site.fax_display }}
          </div>
        </div>
        <iframe class="map" :src="mapSrc" title="Map to Times Produce" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
        <p class="credit">{{ site.credit_text }} <a :href="site.credit_url" target="_blank" rel="noopener">{{ site.credit_name }}</a></p>
      </div>
    </footer>
  </div>
</template>
