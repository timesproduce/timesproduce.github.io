<script setup lang="ts">
import { useData, withBase } from 'vitepress'
const { frontmatter: f } = useData()
</script>

<template>
  <section class="split">
    <div class="photo" :style="{ backgroundImage: `url(${withBase(f.image)})` }" role="img" :aria-label="f.image_alt" />
    <div class="panel cream top">
      <h1>{{ f.heading }}</h1>
      <p>{{ f.intro }}</p>
      <ContactForm :submit-label="f.submit_label" :success-message="f.success_message" :error-message="f.error_message" />
    </div>
  </section>
</template>
