<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { useHref } from '../theme/ui'
const { frontmatter: f } = useData()
const href = useHref()
const list = (items: string[]) => items.join(f.value.list_separator ?? ', ') + (f.value.list_end ?? '.')
</script>

<template>
  <section class="split">
    <div class="photo" :style="{ backgroundImage: `url(${withBase(f.image)})` }" role="img" :aria-label="f.image_alt" />
    <div class="panel cream top">
      <h1>{{ f.heading }}</h1>
      <p>{{ f.intro }}</p>
      <a class="btn solid" :href="href('/contact')">{{ f.button_label }}</a>
      <p v-if="f.ask_more"><strong>{{ f.ask_more }}</strong></p>
      <template v-for="sec in [f.vegetables, f.fruits]" :key="sec.heading">
        <h2 class="sm">{{ sec.heading }}</h2>
        <p v-if="sec.intro">{{ sec.intro }}</p>
        <template v-for="g in sec.groups" :key="g.heading">
          <h3 class="grp">{{ g.heading }}</h3>
          <p class="produce-text">{{ list(g.items) }}</p>
        </template>
      </template>
    </div>
  </section>
</template>
