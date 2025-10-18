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
    async fetchProducts({ commit }) {
      try {
        const response = await api.get('/product/all');
        commit('setItems', response.data);
      } catch (error) {
        console.log('Erro ao carregar produtos: ', error);
      }
    }
  }
}