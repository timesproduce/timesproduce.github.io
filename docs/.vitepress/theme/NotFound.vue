<script setup lang="ts">
import { useHref, useUi } from './ui'
const ui = useUi()
const href = useHref()
</script>

<template>
  <section class="split">
    <div class="panel cream"><h2>{{ ui.not_found.title }}</h2><p><a :href="href('/')">{{ ui.not_found.back }}</a></p></div>
  </section>
</template>
