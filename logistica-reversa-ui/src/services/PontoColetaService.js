// ✨ CÓDIGO CORRIGIDO E ATUALIZADO AQUI
import api from './api';

/**
 * Busca todos os pontos de coleta cadastrados com os detalhes completos.
 * @returns {Promise<Array>} Uma lista de pontos de coleta.
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

/* ✨ ADIÇÃO AQUI: Função para criar um novo Ponto de Coleta */
/**
 * Envia os dados de um novo ponto de coleta para serem salvos no backend.
 * @param {Object} pontoColetaData - Um objeto com { nome, enderecoCompleto, contatoResponsavel, tipoBag }.
 * @returns {Promise<Object>} O novo ponto de coleta criado.
 */
const criarPontoColeta = async (pontoColetaData) => {
  try {
    // Faz a chamada POST para o endpoint que cria pontos de coleta
    const response = await api.post('/api/pontos-coleta', pontoColetaData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar ponto de coleta:", error);
    throw error;
  }
};


const PontoColetaService = {
  getPontosDeColeta,
  criarPontoColeta, // ✨ ADIÇÃO AQUI
};

export default PontoColetaService;