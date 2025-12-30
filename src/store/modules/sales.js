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

        commit('setItems', []);
        console.error('Erro ao carregar o histórico de vendas', error);
      } finally {
        dispatch('ui/stopLoading', null, { root: true });
      }
    },
    async saveSale({ commit, dispatch }, newSale) {
      try {
        dispatch('ui/startLoading', null, { root: true });

        newSale.sellerName = setSeller();

        const response = await api.post('/sale/save', newSale);
        commit('setItems', response.data);

        dispatch('ui/notify', {
          message: 'Venda registrada com sucesso!',
          color: 'success'
        }, { root: true });

        return true;
      } catch (error) {
        const msgError = 'Erro ao registrar a venda';
        dispatch('ui/notify',  { 
          message: msgError, 
          color: 'error' 
        }, { root: true } );
        console.error('Erro ao salvar venda: ', error);

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
