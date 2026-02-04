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
        const response = await api.get('/sale/all');
        const salesNormalized = normalizedSale(response.data);
        commit('setItems', salesNormalized);
      } catch (error) {
        const msgError = 'Erro ao carregar o histórico de vendas';

        dispatch('ui/notify',  { 
          message: msgError, 
          color: 'error' 
        }, { root: true } );

        commit('setItems', []);
        console.error('Erro ao carregar o histórico de vendas', error);
      } finally {
        dispatch('ui/stopLoading', null, { root: true });
      }
    },
    async save({ commit, dispatch }, newItem) {
      try {
        dispatch('ui/startLoading', null, { root: true });

        newItem.sellerName = setSeller();

        const response = await api.post('/sale/save', newItem);
        await dispatch('fetchAll');

        dispatch('ui/notify', {
          message: 'Venda registrada com sucesso!',
          color: 'success'
        }, { root: true });

        return true;
      } catch (error) {
        dispatch('ui/notify',  { 
          message: 'Não foi possível registrar esta venda', 
          color: 'error' 
        }, { root: true } );
        console.error('Erro ao registrar a venda: ', error);

        return false;
      } finally {
        dispatch('ui/stopLoading', null, { root: true });
      }
    },
    async update({ commit, dispatch }, editedItem) {
      try {
        dispatch('ui/startLoading', null, { root: true });

        const response = await api.put(`/sale/update/${editedItem.id}`, editedItem);
        
        await dispatch('fetchAll');

        dispatch('ui/notify', {
          message: 'Venda atualizada com sucesso!',
          color: 'success'
        }, { root: true });

        return true;
      } catch (error) {
        console.error('Erro ao editar a venda: ', error);
        
        dispatch('ui/notify', {
          message: 'Erro ao tentar atualizar esta Venda.',
          color: 'error'
        }, { root: true });

        return false;
      } finally {
        dispatch('ui/stopLoading', null, { root: true });
      }
    },
    async delete({ commit, dispatch }, id) {
      try {
        dispatch('ui/startLoading', null, { root: true });

        await api.delete(`sale/delete/${id}`);
        await dispatch('fetchAll');

        dispatch('ui/notify', {
          message: 'Venda excluída com sucesso!',
          color: 'success'
        }, { root: true });

        return true;
      } catch (error) {
        dispatch('ui/notify',  { 
          message: 'Não foi possível excluir esta venda.', 
          color: 'error'
        }, { root: true } );
        console.error('Erro ao excluir a venda: ', error);

        return false;
      } finally {
        dispatch('ui/stopLoading', null, { root: true });
      }
    }
  }
}

/**
 *  Define o nome do vendedor com base no  Nome e Sobrenome do usuário loggado, 
 * 
 * @returns  Vendedor que realizou a venda. 
 */
function setSeller() {
  //@todobuscar da store a partir do user conectado.
  return 'Lucas Costa';
}

// No final do seu arquivo de Store (Sale)

/**
 * Normaliza os dados brutos vindos do Back-end.
 * Converte Enums para labels amigáveis e adiciona metadados.
 * @param {Array} data - Array de objetos vindos da API.
 * @returns {Array} Array de objetos normalizados.
 */
function normalizedSale(data) {
  if (!data || !Array.isArray(data)) return [];

  const saleStatusMap = {
    'COMPLETED': 'Concluída',
    'CANCELED': 'Cancelada',
    'REFUNDED': 'Reembolsada'
  };

  return data.map(item => ({
    ...item,
    entity: 'sales',
    status: saleStatusMap[item.status] || item.status,
  }));
}
