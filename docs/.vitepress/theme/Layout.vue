<script setup lang="ts">
import { ref, watch } from 'vue'
import { Content, useRoute, withBase } from 'vitepress'

const route = useRoute()
const open = ref(false)
watch(() => route.path, () => (open.value = false))

const links = [
  { text: 'Home', href: '/' },
  { text: 'Our Services', href: '/services' },
  { text: 'Our Produce', href: '/produce' },
  { text: 'Contact', href: '/contact' }
]
const mapSrc =
  'https://maps.google.com/maps?q=1700+Bay+Street,+Los+Angeles,+CA+90021&z=14&output=embed'
</script>

<template>
  <div class="frame">
    <header class="site-header">
      <a :href="withBase('/')" class="brand" aria-label="Times Produce home">
        <img :src="withBase('/images/logo.png')" alt="Times Produce — Est. 1951, Los Angeles, CA" />
      </a>
      <button class="burger" :aria-expanded="open" aria-label="Open site navigation" @click="open = !open">
        <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
          <path d="M8 13h24M8 20h24M8 27h24" stroke="#1c5443" stroke-width="1.6" fill="none" />
        </svg>
      </button>
      <nav v-if="open" class="menu">
        <a v-for="l in links" :key="l.href" :href="withBase(l.href)">{{ l.text }}</a>
      </nav>
    </header>

    <main>
      <Content />
    </main>

    <footer class="site-footer">
      <div class="footer-photo" :style="{ backgroundImage: `url(${withBase('/images/produce.jpg')})` }" role="img"
        aria-label="Historic photo of the Los Angeles produce market" />
      <div class="footer-info">
        <img :src="withBase('/images/clocktower.png')" alt="Times Produce" class="clock" />
        <div class="addr-row">
          <address>1700 Bay Street,<br />Los Angeles<br />CA, 90021.</address>
          <div class="tel">
            <a href="tel:+13232616677">Phone : +1 323.261.6677</a><br />
            Fax : +1 323.261.6688
          </div>
        </div>
        <iframe class="map" :src="mapSrc" title="Map to Times Produce" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
        <p class="credit">© 2022 Design by <a href="http://www.wildernessbrand.studio" target="_blank" rel="noopener">Wilderness Brand</a></p>
      </div>
    </footer>
  </div>
</template>
