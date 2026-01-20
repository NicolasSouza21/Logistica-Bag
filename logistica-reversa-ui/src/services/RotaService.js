// ✨ CÓDIGO ATUALIZADO AQUI
import api from './api';

/**
 * Calcula rota no backend.
 * ✅ Suporta dois formatos:
 * 1) calcularRota({ enderecos: [...] })
 * 2) calcularRota({ coordenadas: [...] })
 *
 * @param {{ enderecos?: string[], coordenadas?: string[] }} payload
 * @returns {Promise<Object>} Um objeto com distanciaTotal, duracaoEstimada e (se existir) polyline.
 */
const calcularRota = async (payload) => {
  try {
    // ✨ ALTERAÇÃO AQUI: valida formato do payload
    if (!payload || typeof payload !== 'object') {
      throw new Error('Payload inválido. Use { enderecos: [...] } ou { coordenadas: [...] }.');
    }

    const { enderecos, coordenadas } = payload;

    if ((!enderecos || enderecos.length === 0) && (!coordenadas || coordenadas.length === 0)) {
      throw new Error('Envie uma lista de endereços ou coordenadas para calcular a rota.');
    }

    // ✨ ALTERAÇÃO AQUI: envia exatamente o que o backend espera (enderecos OU coordenadas)
    const body = enderecos ? { enderecos } : { coordenadas };

    const response = await api.post('/api/rotas/calcular', body);
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
    const response = await api.post('/api/rotas', rotaData);
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar a rota planejada:', error);
    throw error;
  }
};

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
  getRotas,
  aprovarRota,
};

export default RotaService;
