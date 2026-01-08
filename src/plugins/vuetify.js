// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'myColors',
    themes: {
      myColors: {
        dark: false,
        colors: {
          roxo_w1: '#8370FE',
          roxo_w2: '#BDB5FD',
          roxo_w3: '#EAEBFF',
          cinza_w1: '#4e4e4e',
          cinza_w2: '#afafaf',
          verde_w1: '#2a6138',
          vermelho_w1: '#af1818ff',
          vinho_w1: '#612a2aff',
        },
      },
    },
  },
})

export default vuetify;
