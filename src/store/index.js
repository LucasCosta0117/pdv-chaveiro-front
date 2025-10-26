import { createStore } from 'vuex'
import jobs from './modules/jobs';
import products from './modules/products';
import ui from './modules/ui';

export default createStore({
  modules: {
    jobs,
    products,
    ui
  }
})
