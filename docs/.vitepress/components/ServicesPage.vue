<script setup lang="ts">
import { useData, withBase } from 'vitepress'
const { frontmatter: f } = useData()
</script>

<template>
  <section class="split">
    <div class="photo" :style="{ backgroundImage: `url(${withBase(f.image)})` }" role="img" :aria-label="f.image_alt" />
    <div class="panel cream top">
      <h1>{{ f.heading }}</h1>
      <p v-for="(para, i) in String(f.intro).split(/\n\s*\n/)" :key="i">{{ para }}</p>
      <template v-for="s in f.sections" :key="s.heading">
        <h2 class="sm">{{ s.heading }}</h2>
        <p>{{ s.text }}</p>
      </template>
      <a class="btn solid" :href="withBase('/produce')">{{ f.button_label }}</a>
    </div>
  </section>
</template>
