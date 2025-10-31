// Arquivo: src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Aponta para o nosso backend Spring Boot
});

/* ✨ ALTERAÇÃO AQUI */
// Configura um "interceptor" de requisições.
// Isso significa que, ANTES de qualquer requisição ser enviada,
// esta função será executada.
api.interceptors.request.use(
  (config) => {
    // 1. Pega o token do localStorage
    const token = localStorage.getItem('user_token');

    // 2. Se o token existir, adiciona-o ao cabeçalho Authorization
    if (token) {
      // O formato 'Bearer ' é um padrão de mercado para envio de tokens JWT
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. Retorna a configuração modificada para que a requisição prossiga
    return config;
  },
  (error) => {
    // Em caso de erro na configuração da requisição, rejeita a promise
    return Promise.reject(error);
  }
);

export default api;