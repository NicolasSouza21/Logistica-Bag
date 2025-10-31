// ✨ CÓDIGO NOVO AQUI
// Arquivo: src/components/FormNovaColeta.jsx

import React, { useState, useEffect } from 'react';
import PontoColetaService from '../services/PontoColetaService';
import OrdemServicoService from '../services/OrdemServicoService';
import './FormNovaColeta.css';

function FormNovaColeta({ isOpen, onClose, onSave }) {
  const [pontosColeta, setPontosColeta] = useState([]);
  const [pontoColetaId, setPontoColetaId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Busca os pontos de coleta apenas se o modal estiver aberto e a lista vazia
    if (isOpen && pontosColeta.length === 0) {
      PontoColetaService.getPontosDeColeta()
        .then(data => setPontosColeta(data))
        .catch(() => setError('Não foi possível carregar os pontos de coleta.'));
    }
  }, [isOpen, pontosColeta.length]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await OrdemServicoService.criarOrdem(pontoColetaId, parseInt(quantidade, 10));
      onSave(); // Chama a função de sucesso do componente pai (PlanejamentoRotaPage)
      handleClose();
    } catch (err) {
      setError('Erro ao salvar a ordem de serviço.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reseta o formulário ao fechar para a próxima vez que abrir
    setPontoColetaId('');
    setQuantidade('');
    setError('');
    onClose(); // Chama a função onClose passada pelo pai
  };

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Criar Nova Ordem de Coleta</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ponto-coleta">Ponto de Coleta</label>
            <select
              id="ponto-coleta"
              value={pontoColetaId}
              onChange={(e) => setPontoColetaId(e.target.value)}
              required
            >
              <option value="" disabled>Selecione um ponto</option>
              {pontosColeta.map(ponto => (
                <option key={ponto.id} value={ponto.id}>{ponto.nome}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="quantidade">Quantidade Estimada</label>
            <input
              type="number"
              id="quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              required
              min="1"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormNovaColeta;