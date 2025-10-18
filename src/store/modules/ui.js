// store/modules/ui.js
export default {
  namespaced: true,
  state: () => ({
    loading: false,
    snackbar: {
      show: false,
      message: '',
      color: 'success', // opcs: success | error | info | warning
      timeout: 3000
    }
  }),

  mutations: {
    setLoading(state, value) {
      state.loading = value;
    },

    showSnackbar(state, { message, color, timeout = 5000 }) {
      state.snackbar = {
        show: true,
        message,
        color,
        timeout
      }
    },

    hideSnackbar(state) {
      state.snackbar.show = false;
    }
  },

  actions: {
    // Habilita o spinner de carregamento na tela
    startLoading({ commit }) {
      commit('setLoading', true);
    },
    // Desabilita o spinner de carregamento da tela
    stopLoading({ commit }) {
      commit('setLoading', false);
    },

    // Exibe a barra de notificações com a mensagem e cor informada
    notify({ commit }, { message, color }) {
      commit('showSnackbar', { message, color });
    },
    // Oculta a barra de notificações
    hideSnackbar({ commit }) {
      commit('hideSnackbar');
    }
  }
}
