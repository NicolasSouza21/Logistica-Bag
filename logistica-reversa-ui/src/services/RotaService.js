// ✨ CÓDIGO CORRIGIDO E COMPLETO AQUI
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

/* ✨ ADIÇÃO AQUI: A função que estava faltando */
/**
 * Envia os dados da rota planejada para serem salvos no backend.
 * @param {Object} rotaData - Um objeto contendo { ordemIds, distanciaTotal, duracaoEstimada }.
 * @returns {Promise<any>} A resposta do backend (neste caso, o ID da nova rota).
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


const RotaService = {
  calcularRota,
  criarRotaPlanejada, // ✨ ADIÇÃO AQUI: Exportando a nova função
};

export default RotaService;