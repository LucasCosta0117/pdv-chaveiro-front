import axios from "axios";
import store from "../store";
import router from "../router";

/**
 * Instância customizada do Axios para comunicação com o Back-end.
 */
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Interceptor de Requisição (Saída)
 * Injeta o Token JWT em todas as chamadas que saem para a API.
 */
api.interceptors.request.use(
  (config) => {
    // Busca o token fresquinho direto do cofre do Vuex
    const token = store.getters['auth/userToken'];
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Resposta (Chegada)
 * Trata o erro 401 (Token Expirado) de forma global.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se o Java atirou um erro 401 (Token expirado ou inválido)
    if (error.response && error.response.status === 401) {
      console.warn('Sessão expirada ou não autorizada. Redirecionando para o login...');
      
      // Limpa o cofre
      store.dispatch('auth/logout');
      
      // Redireciona o usuário para a tela de Login
      // ATENÇÃO: Confirme se no seu router.js o nome da rota de login é 'Login' (com L maiúsculo ou minúsculo)
      router.push({ name: 'Login' });
    }
    
    return Promise.reject(error);
  }
);

export default api;