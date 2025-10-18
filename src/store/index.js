import { createStore } from 'vuex'
import products from './modules/products';
import ui from './modules/ui';

export default createStore({
  modules: {
    products,
    ui
  }
})
