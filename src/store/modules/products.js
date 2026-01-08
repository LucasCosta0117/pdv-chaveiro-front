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
        const productsNormalized = normalizedProduct(response.data);
        commit('setItems', productsNormalized);
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


/**
 * Normaliza os dados brutos vindos do Back-end.
 * Converte Enums para labels amigáveis e adiciona metadados.
 * @param {Array} data - Array de objetos vindos da API.
 * @returns {Array} Array de objetos normalizados.
 */
function normalizedProduct(data) {
  if (!data || !Array.isArray(data)) return [];

  return data.map(item => ({
    ...item,
    entity: 'products'
  }));
}