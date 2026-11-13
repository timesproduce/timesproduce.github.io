<script setup lang="ts">
import { ref } from 'vue'
import { useData } from 'vitepress'
import { useUi } from '../theme/ui'
import { track } from '../theme/track'

const ui = useUi()
const { localeIndex } = useData()

// The recipient address is configured inside the Formspree dashboard, so it
// never appears in this site's source or HTML. Only the form ID is public.
const endpoint = import.meta.env.VITE_FORM_ENDPOINT || 'https://formspree.io/f/mnpdnbkw'
const props = withDefaults(defineProps<{ submitLabel?: string; successMessage?: string; errorMessage?: string }>(), {
  submitLabel: 'Send message',
  successMessage: "Thanks! We'll be in touch soon.",
  errorMessage: "Sorry, that didn't go through. Please try again."
})
const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')

async function submit(e: Event) {
  const form = e.target as HTMLFormElement
  state.value = 'sending'
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
    if (!res.ok) throw new Error(String(res.status))
    state.value = 'done'
    track('contact_form_submit', localeIndex.value)
    form.reset()
  } catch {
    state.value = 'error'
  }
}
</script>

<template>
  <p v-if="state === 'done'"><strong>{{ props.successMessage }}</strong></p>
  <form v-else class="contact-form" @submit.prevent="submit">
    <div class="row">
      <label>{{ ui.contact_form.first_name }} <input name="first_name" required /></label>
      <label>{{ ui.contact_form.last_name }} <input name="last_name" required /></label>
    </div>
    <div class="row">
      <label>{{ ui.contact_form.email }} <input name="email" type="email" required /></label>
      <label>{{ ui.contact_form.phone }} <input name="phone" type="tel" /></label>
    </div>
    <label>{{ ui.contact_form.company }} <input name="company" /></label>
    <label>{{ ui.contact_form.message }} <textarea name="message" rows="5" :placeholder="ui.contact_form.message_placeholder" required /></label>
    <!-- honeypot: bots fill this in, people never see it -->
    <input type="hidden" name="page_language" :value="localeIndex" />
    <input name="_gotcha" type="text" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true" />
    <button type="submit" :disabled="state === 'sending'">{{ state === 'sending' ? ui.contact_form.sending : props.submitLabel }}</button>
    <p v-if="state === 'error'">{{ props.errorMessage }}</p>
  </form>
</template>
