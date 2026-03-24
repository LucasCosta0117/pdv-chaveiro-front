import { createStore } from 'vuex'
import jobs from './modules/jobs';
import products from './modules/products';
import sales from './modules/sales';
import ui from './modules/ui';
import auth from './modules/auth';

export default createStore({
  modules: {
    auth,
    jobs,
    products,
    sales,
    ui
  }
})
