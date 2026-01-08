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
    async fetchAll({ commit, dispatch }) {
      try {
        dispatch('ui/startLoading', null, { root: true });
        const response = await api.get('/product/all');
        commit('setItems', response.data);
      } catch (error) {
        const msgError = 'Erro ao carregar a lista de produtos';

        dispatch('ui/notify',  { 
          message: msgError, color: 'error' 
        }, { root: true } );

        commit('setItems', []);
        console.error('Erro ao carregar produtos: ', error);
      } finally {
        dispatch('ui/stopLoading', null, { root: true });
      }
    }
  }
}