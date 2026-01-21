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
        dispatch('ui/notify',  { 
          message: 'Não possível carregar a lista de serviços', 
          color: 'error' 
        }, { root: true } );
        
        commit('setItems', []);
        console.error('Erro ao carregar serviços: ', error);
      } finally {
        dispatch('ui/stopLoading', null, { root: true });
      }
    },
    async delete({ commit, dispatch }, id) {
      try {
        dispatch('ui/startLoading', null, { root: true });

        await api.delete(`job/delete/${id}`);
        await dispatch('fetchAll');

        dispatch('ui/notify', {
          message: 'Serviço excluído com sucesso!',
          color: 'success'
        }, { root: true });

        return true;
      } catch (error) {
        dispatch('ui/notify',  { 
          message: 'Não foi possível excluir este serviço.', 
          color: 'error'
        }, { root: true } );
        console.error('Erro ao excluir o serviço: ', error);

        return false;
      } finally {
        dispatch('ui/stopLoading', null, { root: true });
      }
    },
    async save({ commit, dispatch }, newItem) {
      try {
        dispatch('ui/startLoading', null, { root: true });

        const response = await api.post('/job/save', newItem);
        await dispatch('fetchAll');

        dispatch('ui/notify', {
          message: 'Serviço registrado com sucesso!',
          color: 'success'
        }, { root: true });

        return true;
      } catch (error) {
        console.error('Erro ao salvar um novo serviço: ', error);
        dispatch('ui/notify', {
          message: 'Erro ao tentar registrar este Serviço',
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
function normalizedJob(data) {
  if (!data || !Array.isArray(data)) return [];

  return data.map(item => ({
    ...item,
    entity: 'jobs'
  }));
}