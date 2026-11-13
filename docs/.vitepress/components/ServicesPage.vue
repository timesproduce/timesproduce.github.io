<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { useHref } from '../theme/ui'
const { frontmatter: f } = useData()
const href = useHref()
</script>

<template>
  <section class="split">
    <div class="photo" :style="{ backgroundImage: `url(${withBase(f.image)})` }" role="img" :aria-label="f.image_alt" />
    <div class="panel cream top">
      <h1>{{ f.heading }}</h1>
      <p v-for="(para, i) in String(f.intro).split(/\n\s*\n/)" :key="i">{{ para }}</p>
      <template v-if="f.distributor">
        <h2 class="sm">{{ f.distributor.heading }}</h2>
        <p>{{ f.distributor.text }}</p>
        <ul><li v-for="pt in f.distributor.points" :key="pt">{{ pt }}</li></ul>
        <a class="btn solid" :href="href('/contact')">{{ f.distributor.button_label }}</a>
      </template>
      <template v-for="s in f.sections" :key="s.heading">
        <h2 class="sm">{{ s.heading }}</h2>
        <p>{{ s.text }}</p>
      </template>
      <template v-if="f.grower_note">
        <h2 class="sm">{{ f.grower_note.heading }}</h2>
        <p>{{ f.grower_note.text }}</p>
        <a class="btn" :href="href('/grow')">{{ f.grower_note.button_label }}</a>
      </template>
    </div>
  </section>
</template>
