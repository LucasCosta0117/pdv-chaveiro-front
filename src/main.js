import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import api from './api/axios'
import { formatCurrency } from './helpers/formatters'

loadFonts();

const app = createApp(App);

app.config.globalProperties.$api = api;
app.config.globalProperties.$formatCurrency = formatCurrency;

app.use(router)
  .use(store)
  .use(vuetify)
  .mount('#app');