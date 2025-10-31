// ✨ CÓDIGO NOVO AQUI
// Arquivo: src/services/OrdemServicoService.js

import api from './api';

/**
 * Busca todas as ordens de serviço que correspondem a um status específico.
 * @param {string} status - O status a ser filtrado (ex: 'PENDENTE').
 * @returns {Promise<Array>} Uma lista de ordens de serviço.
 */
const getOrdensPorStatus = async (status) => {
  try {
    const response = await api.get('/api/ordens-servico', {
      params: { status } // O Axios transforma isso em ?status=PENDENTE na URL
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar ordens com status ${status}:`, error);
    throw error;
  }
};

/**
 * Cria uma nova ordem de serviço.
 * @param {number} pontoColetaId - O ID do ponto de coleta.
 * @param {number} quantidadeEstimada - A quantidade de bags estimada.
 * @returns {Promise<Object>} A nova ordem de serviço criada.
 */
const criarOrdem = async (pontoColetaId, quantidadeEstimada) => {
  try {
    const response = await api.post('/api/ordens-servico', {
      pontoColetaId,
      quantidadeEstimada,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar ordem de serviço:", error);
    throw error;
  }
};

const OrdemServicoService = {
  getOrdensPorStatus,
  criarOrdem,
};

export default OrdemServicoService;