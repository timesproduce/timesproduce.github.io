import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import HomePage from '../components/HomePage.vue'
import ServicesPage from '../components/ServicesPage.vue'
import ProducePage from '../components/ProducePage.vue'
import ContactPage from '../components/ContactPage.vue'
import ContactForm from '../components/ContactForm.vue'
import GrowPage from '../components/GrowPage.vue'
import GrowerForm from '../components/GrowerForm.vue'
import './custom.css'

export default {
  Layout,
  NotFound,
  enhanceApp({ app }) {
    app.component('ContactForm', ContactForm)
    app.component('HomePage', HomePage)
    app.component('ServicesPage', ServicesPage)
    app.component('ProducePage', ProducePage)
    app.component('ContactPage', ContactPage)
    app.component('GrowPage', GrowPage)
    app.component('GrowerForm', GrowerForm)
  }
}
