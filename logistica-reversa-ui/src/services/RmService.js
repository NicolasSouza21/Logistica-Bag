// ✨ CÓDIGO ATUALIZADO AQUI
import api from './api';

const buscarEnderecoColeta = async (codCfo, cidadeColeta) => {
  try {
    const response = await api.get('/api/rm/coleta', {
      params: { codCfo, cidadeColeta }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar RM:', error);
    throw error;
  }
};

const RmService = {
  buscarEnderecoColeta,
};

export default RmService;
