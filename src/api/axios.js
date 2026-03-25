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
 * Trata o erro 401 e 403 (Token Expirado e Token Invalido) de forma global.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      store.dispatch('auth/logout');
      router.push({ name: 'login' });
    }
    
    return Promise.reject(error);
  }
);

export default api;