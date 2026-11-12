import DefaultTheme from 'vitepress/theme'
import ContactForm from '../components/ContactForm.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ContactForm', ContactForm)
  }
}
