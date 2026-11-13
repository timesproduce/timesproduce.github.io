<script setup lang="ts">
import { ref } from 'vue'
import { useData } from 'vitepress'
import { useUi } from '../theme/ui'
import { track } from '../theme/track'

// Short on purpose: many growers prefer the phone and don't use email,
// so only name, phone and crops are required (email is optional).
const endpoint = import.meta.env.VITE_FORM_ENDPOINT || 'https://formspree.io/f/mnpdnbkw'
const props = withDefaults(defineProps<{ submitLabel?: string; successMessage?: string; errorMessage?: string }>(), {
  submitLabel: 'Send',
  successMessage: 'Thank you! We will call you soon.',
  errorMessage: 'Sorry, that did not work. Please try again.'
})
const ui = useUi()
const { localeIndex } = useData()
const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')

async function submit(e: Event) {
  const form = e.target as HTMLFormElement
  state.value = 'sending'
  try {
    const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(String(res.status))
    state.value = 'done'
    track('grower_form_submit', localeIndex.value)
    form.reset()
  } catch {
    state.value = 'error'
  }
}
</script>

<template>
  <p v-if="state === 'done'"><strong>{{ props.successMessage }}</strong></p>
  <form v-else id="grower-form" class="contact-form" @submit.prevent="submit">
    <input type="hidden" name="inquiry_type" value="grower" />
    <input type="hidden" name="page_language" :value="localeIndex" />
    <label>{{ ui.grower_form.name }} <input name="name" autocomplete="name" required /></label>
    <label>{{ ui.grower_form.phone }} <input name="phone" type="tel" autocomplete="tel" required /></label>
    <label>{{ ui.grower_form.email }} <input name="email" type="email" autocomplete="email" /></label>
    <label>{{ ui.grower_form.crops }} <textarea name="crops" rows="3" :placeholder="ui.grower_form.crops_placeholder" required /></label>
    <input name="_gotcha" type="text" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true" />
    <button type="submit" :disabled="state === 'sending'">{{ state === 'sending' ? ui.grower_form.sending : props.submitLabel }}</button>
    <p v-if="state === 'error'">{{ props.errorMessage }}</p>
  </form>
</template>
