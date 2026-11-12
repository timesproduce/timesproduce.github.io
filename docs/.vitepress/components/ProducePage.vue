<script setup lang="ts">
import { useData, withBase } from 'vitepress'
const { frontmatter: f } = useData()
const list = (items: string[]) => items.join(', ') + '.'
</script>

<template>
  <section class="split">
    <div class="photo" :style="{ backgroundImage: `url(${withBase(f.image)})` }" role="img" :aria-label="f.image_alt" />
    <div class="panel cream top">
      <h1>{{ f.heading }}</h1>
      <p>{{ f.intro }}</p>
      <a class="btn solid" :href="withBase('/contact')">{{ f.button_label }}</a>
      <h2 class="sm">{{ f.vegetables.heading }}</h2>
      <p v-if="f.vegetables.intro">{{ f.vegetables.intro }}</p>
      <p class="produce-text">{{ list(f.vegetables.items) }}</p>
      <h2 class="sm">{{ f.fruits.heading }}</h2>
      <p v-if="f.fruits.intro">{{ f.fruits.intro }}</p>
      <p class="produce-text">{{ list(f.fruits.items) }}</p>
    </div>
  </section>
</template>
