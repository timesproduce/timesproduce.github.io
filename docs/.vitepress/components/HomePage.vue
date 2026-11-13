<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { useHref } from '../theme/ui'
const { frontmatter: f } = useData()
const href = useHref()
const bg = (p: string) => ({ backgroundImage: `url(${withBase(p)})` })
</script>

<template>
  <section class="split">
    <div class="panel cream">
      <p v-if="f.hero.eyebrow" class="eyebrow">{{ f.hero.eyebrow }}</p>
      <h1>{{ f.hero.heading }}</h1>
      <p>{{ f.hero.text }}</p>
    </div>
    <div class="photo" :style="bg(f.hero.image)" role="img" :aria-label="f.hero.image_alt" />
    <div class="panel mint"><h2 class="md">{{ f.aspects_heading }}</h2></div>
    <div class="panel green aspects">
      <div v-for="a in f.aspects" :key="a.title" class="aspect">
        <svg viewBox="0 0 120 90" aria-hidden="true">
          <path v-if="a.icon === 'box'" d="M20 55l30-14 30 14-30 14z M20 55v18l30 14V69 M50 69v18l30-14V55 M60 36l30-14 20 9-30 14z" />
          <g v-else-if="a.icon === 'globe'"><circle cx="60" cy="40" r="32" /><ellipse cx="60" cy="40" rx="14" ry="32" /><path d="M28 40h64M33 24h54M33 56h54" /></g>
          <path v-else d="M38 12h34v66H38z M46 30l6 6 10-12 M46 50l6 6 10-12" />
        </svg>
        <h3>{{ a.title }}</h3>
        <p>{{ a.text }}</p>
      </div>
      <a class="btn" :href="href('/services')">{{ f.button_label }}</a>
    </div>
    <div class="photo tall" :style="bg(f.bottom_image)" role="img" :aria-label="f.bottom_image_alt" />
  </section>
  <section v-if="f.audiences" class="split audiences">
    <div class="panel cream">
      <h2 class="md">{{ f.audiences.buyers.heading }}</h2>
      <p>{{ f.audiences.buyers.text }}</p>
      <a class="btn solid" :href="href('/contact')">{{ f.audiences.buyers.button_label }}</a>
    </div>
    <div class="panel mint">
      <h2 class="md">{{ f.audiences.growers.heading }}</h2>
      <p>{{ f.audiences.growers.text }}</p>
      <a class="btn solid" :href="href('/grow')">{{ f.audiences.growers.button_label }}</a>
    </div>
  </section>
</template>
