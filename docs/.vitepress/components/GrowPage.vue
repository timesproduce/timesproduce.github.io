<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { useHref } from '../theme/ui'
const { frontmatter: f } = useData()
const href = useHref()
const bg = (p: string) => ({ backgroundImage: `url(${withBase(p)})` })
</script>

<template>
  <section class="split">
    <div class="photo" :style="bg(f.image)" role="img" :aria-label="f.image_alt" />
    <div class="panel cream top">
      <h1>{{ f.heading }}</h1>
      <p v-for="(para, i) in String(f.intro).split(/\n\s*\n/)" :key="i">{{ para }}</p>
      <div class="btn-row"><a class="btn solid" href="#grower-form">{{ f.form_button_label }}</a></div>
      <h2 class="sm">{{ f.what_we_buy.heading }}</h2>
      <p>{{ f.what_we_buy.text }}</p>
      <p v-for="item in f.what_we_buy.items" :key="item">{{ item }}</p>
    </div>

    <div class="panel mint top">
      <h2 class="md">{{ f.food_safety.heading }}</h2>
      <p>{{ f.food_safety.text }}</p>
      <p>{{ f.food_safety.help }}</p>
    </div>
    <div class="panel cream top">
      <h2 class="md">{{ f.form.heading }}</h2>
      <p>{{ f.form.intro }}</p>
      <GrowerForm :submit-label="f.submit_label" :success-message="f.success_message" :error-message="f.error_message" />
      <template v-if="f.faq">
        <h2 class="sm">{{ f.faq_heading }}</h2>
        <dl class="faq"><template v-for="item in f.faq" :key="item.question"><dt>{{ item.question }}</dt><dd>{{ item.answer }}</dd></template></dl>
      </template>
      <p class="note"><a :href="href('/contact')">{{ f.buyer_link_label }}</a></p>
    </div>
  </section>
</template>
