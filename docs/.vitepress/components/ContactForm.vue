<script setup lang="ts">
import { ref } from 'vue'

// The recipient address is configured inside the Formspree dashboard, so it
// never appears in this site's source or HTML. Only the form ID is public.
const endpoint = import.meta.env.VITE_FORM_ENDPOINT || 'https://formspree.io/f/mnpdnbkw'
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
    form.reset()
  } catch {
    state.value = 'error'
  }
}
</script>

<template>
  <p v-if="state === 'done'"><strong>Thanks! We'll be in touch soon.</strong></p>
  <form v-else class="contact-form" @submit.prevent="submit">
    <div class="row">
      <label>First Name <input name="first_name" required /></label>
      <label>Last Name <input name="last_name" required /></label>
    </div>
    <div class="row">
      <label>Email <input name="email" type="email" required /></label>
      <label>Phone <input name="phone" type="tel" /></label>
    </div>
    <label>Company <input name="company" /></label>
    <label>Message <textarea name="message" rows="5" placeholder="How can we help?" required /></label>
    <!-- honeypot: bots fill this in, people never see it -->
    <input name="_gotcha" type="text" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true" />
    <button type="submit" :disabled="state === 'sending'">{{ state === 'sending' ? 'Sending…' : 'Send message' }}</button>
    <p v-if="state === 'error'">Sorry, that didn't go through. Please try again, or give us a call at +1 323.261.6677.</p>
  </form>
</template>
