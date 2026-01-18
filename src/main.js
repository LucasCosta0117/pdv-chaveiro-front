import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import api from './api/axios'
import { formatCurrency, formatDateTime } from './helpers/formatters'
import { loginAnonimo } from './services/firebase';

loadFonts();
loginAnonimo(); //@todo talvez encapsular isso em um async init(), para garantir o login no firebase antes de montar o app

const app = createApp(App);

app.config.globalProperties.$api = api;
app.config.globalProperties.$formatCurrency = formatCurrency;
app.config.globalProperties.$formatDateTime = formatDateTime;

app.use(router)
  .use(store)
  .use(vuetify)
  .mount('#app');