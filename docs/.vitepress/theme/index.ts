import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import ContactForm from '../components/ContactForm.vue'
import './custom.css'

export default {
  Layout,
  NotFound,
  enhanceApp({ app }) {
    app.component('ContactForm', ContactForm)
  }
}
