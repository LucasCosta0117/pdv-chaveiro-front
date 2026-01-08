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
        const response = await api.get('/job/all');
        const jobsNormalized = normalizedJob(response.data);
        commit('setItems', jobsNormalized);
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

/**
 * Normaliza os dados brutos vindos do Back-end.
 * Converte Enums para labels amigáveis e adiciona metadados.
 * @param {Array} data - Array de objetos vindos da API.
 * @returns {Array} Array de objetos normalizados.
 */
function normalizedJob(data) {
  if (!data || !Array.isArray(data)) return [];

  return data.map(item => ({
    ...item,
    entity: 'jobs'
  }));
}