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
        dispatch('ui/notify',  { 
          message: 'Não possível carregar a lista de produtos', 
          color: 'error' 
        }, { root: true } );

        commit('setItems', []);
        console.error('Erro ao carregar produtos: ', error);
      } finally {
        dispatch('ui/stopLoading', null, { root: true });
      }
    },
    async delete({ commit, dispatch }, id) {
      try {
        dispatch('ui/startLoading', null, { root: true });

        await api.delete(`product/delete/${id}`);
        await dispatch('fetchAll');

        dispatch('ui/notify', {
          message: 'Produto excluído com sucesso!',
          color: 'success'
        }, { root: true });

        return true;
      } catch (error) {
        dispatch('ui/notify',  { 
          message: 'Não foi possível excluir este produto.', 
          color: 'error'
        }, { root: true } );
        console.error('Erro ao excluir o produto: ', error);

        return false;
      } finally {
        dispatch('ui/stopLoading', null, { root: true });
      }
    },
    async save({ commit, dispatch }, newItem) {
      try {
        dispatch('ui/startLoading', null, { root: true });

        const response = await api.post('/product/save', newItem);
        await dispatch('fetchAll');

        dispatch('ui/notify', {
          message: 'Produto registrado com sucesso!',
          color: 'success'
        }, { root: true });

        return true;
      } catch (error) {
        console.error('Erro ao salvar um novo produto: ', error);
        dispatch('ui/notify', {
          message: 'Erro ao tentar registrar este Produto',
          color: error
        },{ root: true });

        return false;
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