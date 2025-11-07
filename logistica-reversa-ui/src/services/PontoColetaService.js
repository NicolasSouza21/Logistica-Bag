// ✨ CÓDIGO ATUALIZADO AQUI
import api from './api';

/**
 * Busca todos os pontos de coleta cadastrados.
 */
const getPontosDeColeta = async () => {
  try {
    const response = await api.get('/api/pontos-coleta');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pontos de coleta:", error);
    throw error;
  }
};

/**
 * Envia os dados de um novo ponto de coleta para serem salvos.
 * @param {Object} pontoColetaData - Um objeto com { nome, enderecoCompleto, ... tiposBag }
 */
const criarPontoColeta = async (pontoColetaData) => {
  try {
    const response = await api.post('/api/pontos-coleta', pontoColetaData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar ponto de coleta:", error);
    throw error;
  }
};

/* ✨ ALTERAÇÃO AQUI: Adiciona a função de ATUALIZAR */
/**
 * Envia os dados de um ponto de coleta para serem atualizados.
 * @param {number} id - O ID do ponto de coleta a ser atualizado.
 * @param {Object} pontoColetaData - O objeto com os dados.
 */
const atualizarPontoColeta = async (id, pontoColetaData) => {
  try {
    // Faz a chamada PUT para o endpoint /api/pontos-coleta/{id}
    const response = await api.put(`/api/pontos-coleta/${id}`, pontoColetaData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar ponto de coleta ${id}:`, error);
    throw error;
  }
};

/* ✨ ALTERAÇÃO AQUI: Adiciona a função de DELETAR */
/**
 * Solicita a exclusão de um ponto de coleta.
 * @param {number} id - O ID do ponto de coleta a ser deletado.
 */
const deletarPontoColeta = async (id) => {
  try {
    // Faz a chamada DELETE para o endpoint /api/pontos-coleta/{id}
    const response = await api.delete(`/api/pontos-coleta/${id}`);
    return response.data; // Geralmente retorna 204 No Content (vazio)
  } catch (error) {
    console.error(`Erro ao deletar ponto de coleta ${id}:`, error);
    throw error;
  }
};


const PontoColetaService = {
  getPontosDeColeta,
  criarPontoColeta,
  atualizarPontoColeta, // ✨ ALTERAÇÃO AQUI
  deletarPontoColeta, // ✨ ALTERAÇÃO AQUI
};

export default PontoColetaService;