// ✨ CÓDIGO NOVO AQUI
// Arquivo: src/services/AuthService.js

import api from './api';

const login = async (username, password) => {
  try {
    // Faz a requisição POST para o endpoint de login do Spring Boot
    const response = await api.post('/api/auth/login', {
      username: username,
      password: password,
    });

    // Se a requisição for bem-sucedida (status 2xx), o token estará no corpo da resposta
    if (response.data.token) {
      // Armazena o token no localStorage para uso futuro
      localStorage.setItem('user_token', response.data.token);
    }
    
    // Retorna os dados da resposta (pode incluir informações do usuário, etc.)
    return response.data;
  } catch (error) {
    // Se ocorrer um erro, o Axios o encapsula no objeto 'error'
    // Podemos relançar o erro para que o componente de UI possa tratá-lo
    console.error("Erro no login:", error);
    throw error;
  }
};

const logout = () => {
  // Simplesmente remove o token do localStorage
  localStorage.removeItem('user_token');
};

const AuthService = {
  login,
  logout,
};

export default AuthService;