// ✨ CÓDIGO ATUALIZADO AQUI
import api from './api';

/**
 * Envia uma lista de endereços para o backend para calcular a rota otimizada.
 * @param {string[]} enderecos - Uma lista de strings, onde cada string é um endereço.
 * @returns {Promise<Object>} Um objeto com a distância e duração total.
 */
const calcularRota = async (enderecos) => {
  try {
    const response = await api.post('/api/rotas/calcular', { enderecos });
    return response.data;
  } catch (error) {
    console.error('Erro ao chamar a API de cálculo de rota:', error);
    throw error;
  }
};

/**
 * Envia os dados da rota planejada para serem salvos no backend.
 * @param {Object} rotaData - Um objeto contendo { ordemIds, distanciaTotal, duracaoEstimada, valorFrete }.
 * @returns {Promise<any>} A resposta do backend (a rota criada).
 */
const criarRotaPlanejada = async (rotaData) => {
  try {
    // Faz a chamada POST para o endpoint que criamos no RotaController do backend
    const response = await api.post('/api/rotas', rotaData);
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar a rota planejada:', error);
    throw error;
  }
};

/* ✨ ALTERAÇÃO AQUI: Novas funções para listar e aprovar rotas */

/**
 * Busca todas as rotas cadastradas.
 * @returns {Promise<Array>} Uma lista de rotas (DTOs).
 */
const getRotas = async () => {
  try {
    const response = await api.get('/api/rotas');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar rotas:', error);
    throw error;
  }
};

/**
 * Aprova uma rota específica (muda o status para APROVADA).
 * @param {number} rotaId - O ID da rota a ser aprovada.
 * @returns {Promise<Object>} A rota atualizada (DTO).
 */
const aprovarRota = async (rotaId) => {
  try {
    const response = await api.put(`/api/rotas/${rotaId}/aprovar`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao aprovar a rota ${rotaId}:`, error);
    throw error;
  }
};


const RotaService = {
  calcularRota,
  criarRotaPlanejada,
  getRotas, // ✨ ADIÇÃO AQUI
  aprovarRota, // ✨ ADIÇÃO AQUI
};

export default RotaService;