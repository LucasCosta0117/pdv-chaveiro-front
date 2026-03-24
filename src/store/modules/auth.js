import api from '../../api/axios';

/**
 * Módulo Vuex responsável pela Autenticação e Perfil do Usuário.
 * Gerencia o estado do Token JWT e os dados do usuário logado.
 */
export default {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem('izi_token') || null,
    user: JSON.parse(localStorage.getItem('izi_user')) || null,
  }),
  getters: {
    // Retorna true se existe um token (usuário está logado)
    isAuthenticated: (state) => !!state.token,
    
    // Retorna os dados do usuário (nome, email, role, companyId)
    currentUser: (state) => state.user,
    
    // Retorna o token JWT atual
    userToken: (state) => state.token,
  },
  mutations: {
    /**
     * Salva o token no estado do Vuex e no LocalStorage do navegador.
     */
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('izi_token', token);
    },

    /**
     * Salva os dados do perfil do usuário no estado e no LocalStorage.
     */
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('izi_user', JSON.stringify(user));
    },

    /**
     * Limpa todos os dados de autenticação (usado no Logout ou quando o token expira).
     */
    CLEAR_AUTH(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('izi_token');
      localStorage.removeItem('izi_user');
    }
  },
  actions: {
    /**
     * Realiza o login na API, salva o token e em seguida busca o perfil do usuário.
     * @param {Object} credentials Objeto contendo { email, password }
     */
    async login({ commit, dispatch }, credentials) {
      const response = await api.post('/api/auth/login', credentials);
      const token = response.data.token;
      commit('SET_TOKEN', token);
      await dispatch('fetchUserProfile');
    },

    /**
     * Busca os dados do usuário autenticado
     */
    async fetchUserProfile({ commit }) {
      const response = await api.get('/api/users/me');
      commit('SET_USER', response.data);
    },

    /**
     * Remove os dados do usuário e do token, encerrando a sessão.
     */
    logout({ commit }) {
      commit('CLEAR_AUTH');
    },

    /**
     * Restaura o cabeçalho do Axios se o usuário atualizar a página (F5).
     */
    initializeAuth({ state, commit }) {
      if (state.token) {
        commit('SET_TOKEN', state.token);
      }
    }
  }
};