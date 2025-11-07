// ✨ CÓDIGO ATUALIZADO AQUI
import api from './api';

/**
 * Busca todas as ordens de serviço que correspondem a um status específico.
 */
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

/**
 * Busca os detalhes completos de uma lista de ordens de serviço por seus IDs.
 */
const getOrdensByIds = async (ids) => {
  try {
    // O backend espera os IDs como uma lista no corpo da requisição
    const response = await api.post('/api/ordens-servico/by-ids', ids); 
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar ordens por IDs:`, error);
    throw error;
  }
};


/* ✨ ALTERAÇÃO AQUI: O método agora recebe um único objeto 'ordemData' */
/**
 * Cria uma nova ordem de serviço.
 * @param {Object} ordemData - Objeto contendo { pontoColetaId, quantidadesEstimadas (Map) }
 * @returns {Promise<Object>} A nova ordem de serviço criada.
 */
const criarOrdem = async (ordemData) => {
  try {
    // O backend espera um DTO { pontoColetaId, quantidadesEstimadas: {...} }
    const response = await api.post('/api/ordens-servico', ordemData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar ordem de serviço:", error);
    throw error;
  }
};

const OrdemServicoService = {
  getOrdensPorStatus,
  getOrdensByIds, // ✨ Verifique se você tem esse método
  criarOrdem,
};

export default OrdemServicoService;