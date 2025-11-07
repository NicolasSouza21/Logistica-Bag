// ✨ CÓDIGO ATUALIZADO AQUI
// Arquivo: src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Aponta para o nosso backend Spring Boot
});

// Configura um "interceptor" de REQUISIÇÃO (o que você já tinha)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ✨ ALTERAÇÃO AQUI: Adicionamos um interceptador de RESPOSTA */
// Configura um "interceptor" de RESPOSTA para tratar erros globalmente
api.interceptors.response.use(
  // 1. Se a resposta for bem-sucedida (status 2xx), apenas a repasse
  (response) => {
    return response;
  },
  // 2. Se a resposta for um erro...
  (error) => {
    // Verifica se o erro é um 401 (Unauthorized).
    // O backend Spring envia 401 quando o token é expirado ou inválido.
    if (error.response && error.response.status === 401) {
      // Limpa o token inválido do localStorage
      localStorage.removeItem('user_token');
      
      // Redireciona o usuário para a página de login.
      // Usamos window.location para forçar um refresh da aplicação,
      // limpando qualquer estado antigo do React.
      window.location.href = '/login';
    }

    // Repassa o erro para que o componente que fez a chamada (ex: um .jsx)
    // possa tratá-lo (ex: parar um 'loading')
    return Promise.reject(error);
  }
);


export default api;