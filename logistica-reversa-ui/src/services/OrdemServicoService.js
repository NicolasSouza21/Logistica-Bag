import api from './api';

const getOrdensPorStatus = async (status) => {
  try {
    const response = await api.get('/api/ordens-servico', {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar ordens com status ${status}:`, error);
    throw error;
  }
};

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

/* ✨ ALTERAÇÃO AQUI: Adiciona a função que estava faltando */
/**
 * Busca os detalhes completos de uma lista de ordens de serviço a partir de seus IDs.
 * @param {number[]} ids - Um array com os IDs das ordens.
 * @returns {Promise<Array>} Uma lista com os detalhes das ordens de serviço.
 */
const getOrdensByIds = async (ids) => {
  try {
    // Faz a chamada POST para o endpoint /by-ids que criamos no backend
    const response = await api.post('/api/ordens-servico/by-ids', ids);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ordens por IDs:", error);
    throw error;
  }
};

const OrdemServicoService = {
  getOrdensPorStatus,
  criarOrdem,
  getOrdensByIds, // ✨ ALTERAÇÃO AQUI: Exporta a nova função
};

export default OrdemServicoService;