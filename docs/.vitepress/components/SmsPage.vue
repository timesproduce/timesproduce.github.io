<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import site from '../site.json'
import { useUi } from '../theme/ui'
import { track } from '../theme/track'

const { frontmatter: f, localeIndex } = useData()
const ui = useUi()

// The recipient address is configured inside the Formspree dashboard, so it
// never appears in this site's source or HTML. Only the form ID is public.
const endpoint = import.meta.env.VITE_FORM_ENDPOINT || 'https://formspree.io/f/mnpdnbkw'

const privacyUrl = withBase('/privacy-policy.pdf')
const termsUrl = withBase('/sms-terms-and-conditions.pdf')

// The sentence about privacy has {privacy} and {terms} markers that become links.
const privacyParts = computed(() =>
  String(f.value.consent_privacy)
    .split(/(\{privacy\}|\{terms\})/)
    .map((text) =>
      text === '{privacy}'
        ? { text: f.value.privacy_link_text, href: privacyUrl }
        : text === '{terms}'
          ? { text: f.value.terms_link_text, href: termsUrl }
          : { text, href: '' }
    )
)
// The exact words the person agreed to, saved with their sign-up as a record of consent.
const consentRecord = computed(() =>
  [f.value.consent_yes_label, f.value.consent_details, privacyParts.value.map((p) => p.text).join('')].join('\n\n')
)

const choice = ref<'' | 'yes' | 'no'>('')
const notice = ref('')
const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')

function pick(which: 'yes' | 'no', checked: boolean) {
  choice.value = checked ? which : ''
  notice.value = ''
}

// Proof of consent: when it was given, from what page and browser. Formspree adds the IP address.
function consentData(form: HTMLFormElement) {
  const data = new FormData(form)
  data.append('consent_timestamp', new Date().toISOString())
  data.append('consent_page', location.href)
  data.append('consent_browser', navigator.userAgent)
  return data
}

async function submit(e: Event) {
  const form = e.target as HTMLFormElement
  if (choice.value !== 'yes') {
    // Nothing is sent unless the person ticked "Yes".
    notice.value = choice.value === 'no' ? f.value.no_message : f.value.choose_message
    return
  }
  state.value = 'sending'
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: consentData(form),
      headers: { Accept: 'application/json' }
    })
    if (!res.ok) throw new Error(String(res.status))
    state.value = 'done'
    track('sms_signup_submit', localeIndex.value)
    form.reset()
    choice.value = ''
  } catch {
    state.value = 'error'
  }
}
</script>

<template>
  <section class="split">
    <div class="photo" :style="{ backgroundImage: `url(${withBase(f.image)})` }" role="img" :aria-label="f.image_alt" />
    <div class="panel cream top">
      <h1>{{ f.heading }}</h1>
      <p>{{ f.intro }}</p>

      <div v-if="state === 'done'" role="status">
        <p><strong>{{ f.success_message }}</strong></p>
      </div>
      <form v-else class="contact-form sms-form" @submit.prevent="submit">
        <label>{{ f.name_label }} <input name="name" autocomplete="name" required /></label>
        <label>{{ f.company_label }} <input name="company" autocomplete="organization" required /></label>
        <div class="row">
          <label>{{ f.phone_label }} <input name="phone" type="tel" inputmode="tel" autocomplete="tel" required /></label>
          <label>{{ f.email_label }} <input name="email" type="email" autocomplete="email" /></label>
        </div>

        <div class="consent-box">
          <input id="sms-yes" type="checkbox" :checked="choice === 'yes'" @change="pick('yes', ($event.target as HTMLInputElement).checked)" />
          <div>
            <label for="sms-yes"><strong>{{ f.consent_yes_label }}</strong></label>
            <p>{{ f.consent_details }}</p>
            <p>
              <template v-for="(p, i) in privacyParts" :key="i">
                <a v-if="p.href" :href="p.href" target="_blank" rel="noopener">{{ p.text }}</a>
                <template v-else>{{ p.text }}</template>
              </template>
            </p>
          </div>
        </div>
        <div class="consent-box">
          <input id="sms-no" type="checkbox" :checked="choice === 'no'" @change="pick('no', ($event.target as HTMLInputElement).checked)" />
          <label for="sms-no">{{ f.consent_no_label }}</label>
        </div>

        <input type="hidden" name="form_type" value="sms_signup" />
        <input type="hidden" name="_subject" value="Text message sign-up" />
        <input type="hidden" name="sms_consent" :value="choice === 'yes' ? 'yes' : ''" />
        <input type="hidden" name="sms_consent_text" :value="consentRecord" />
        <input type="hidden" name="page_language" :value="localeIndex" />
        <!-- honeypot: bots fill this in, people never see it -->
        <input name="_gotcha" type="text" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true" />

        <button type="submit" :disabled="state === 'sending'">{{ state === 'sending' ? ui.contact_form.sending : f.submit_label }}</button>
        <p v-if="notice" role="alert">{{ notice }}</p>
        <p v-if="state === 'error'" role="alert">{{ f.error_message }}</p>
      </form>

      <p class="note">{{ site.name }} Inc., {{ site.address.street }}, {{ site.address.city }}, {{ site.address.state }} {{ site.address.zip }} · (323) 261-6677 · orders@timesproduce.com</p>
      <p class="note">
        <a :href="termsUrl" target="_blank" rel="noopener">{{ f.terms_link_text }}</a> ·
        <a :href="privacyUrl" target="_blank" rel="noopener">{{ f.privacy_link_text }}</a>
        <template v-if="f.docs_note"> · {{ f.docs_note }}</template>
      </p>
    </div>
  </section>
</template>
