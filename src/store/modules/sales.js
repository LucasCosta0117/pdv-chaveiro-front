import api from "@/api/axios";

export default {
  namespaced: true,
  state: () => ({
    items: []
  }),
  getters: {
    getItems: (state) => state.items,
  },
  mutations: {
    setItems(state, items) {
      state.items = items
    }
  },
  actions: {
    async fetchSales({ commit, dispatch }) {
      try {
        dispatch('ui/startLoading', null, { root: true });
        const response = await api.get('/sale/all');
        commit('setItems', response.data);
      } catch (error) {
        const msgError = 'Erro ao carregar o histórico de vendas';

        dispatch('ui/notify',  { 
          message: msgError, 
          color: 'error' 
        }, { root: true } );

        console.error('Erro ao carregar produtos: ', error);
      } finally {
        dispatch('ui/stopLoading', null, { root: true });
      }
    },
    async saveSale({ commit, dispatch }, newSale) {
      try {
        dispatch('ui/startLoading', null, { root: true });
        
        console.log('newSale', newSale)
        const response = await api.post('/sale/save', newSale);
        commit('setItems', response.data);

        dispatch('ui/notify', {
          message: 'Venda registrada com sucesso!',
          color: 'success'
        }, { root: true });
      } catch (error) {
        const msgError = 'Erro ao registrar a venda';
        dispatch('ui/notify',  { 
          message: msgError, 
          color: 'error' 
        }, { root: true } );
        
        console.error('Erro ao salvar venda: ', error);
      } finally {
        dispatch('ui/stopLoading', null, { root: true });
      }
    }
  }
}