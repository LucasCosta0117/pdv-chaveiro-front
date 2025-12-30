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
    async fetchJobs({ commit, dispatch }) {
      try {
        dispatch('ui/startLoading', null, { root: true });
        const response = await api.get('/job/all');
        commit('setItems', response.data);
      } catch (error) {
        const msgError = 'Erro ao carregar a lista de serviços';

        dispatch('ui/notify',  { 
          message: msgError, 
          color: 'error' 
        }, { root: true } );
        
        commit('setItems', []);
        console.error('Erro ao carregar serviços: ', error);
      } finally {
        dispatch('ui/stopLoading', null, { root: true });
      }
    }
  }
}