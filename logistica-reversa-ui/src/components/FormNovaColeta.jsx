// ✨ CÓDIGO ATUALIZADO AQUI
import React, { useState, useEffect, useMemo } from 'react';
import PontoColetaService from '../services/PontoColetaService';
import OrdemServicoService from '../services/OrdemServicoService';
import './FormNovaColeta.css';

function FormNovaColeta({ isOpen, onClose, onSave }) {
  const [pontosColeta, setPontosColeta] = useState([]);
  const [pontoColetaId, setPontoColetaId] = useState('');
  
  /* ✨ 1. ESTADO PARA O MAPA DE QUANTIDADES */
  const [quantidadesMap, setQuantidadesMap] = useState({}); // Ex: {"Bag Vermelha": 10, "Bag Lona": 5}
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Busca os pontos de coleta quando o modal abre
  useEffect(() => {
    if (isOpen) {
      PontoColetaService.getPontosDeColeta()
        .then(data => setPontosColeta(data))
        .catch(() => setError('Não foi possível carregar os pontos de coleta.'));
    }
  }, [isOpen]);

  /* ✨ 2. ACHA O PONTO SELECIONADO NA LISTA */
  const pontoSelecionado = useMemo(() => {
    // Encontra o objeto PontoColeta completo com base no ID selecionado
    return pontosColeta.find(p => p.id.toString() === pontoColetaId);
  }, [pontosColeta, pontoColetaId]);

  /* ✨ 3. FUNÇÃO PARA ATUALIZAR O MAPA DE QUANTIDADES */
  const handleQuantidadeChange = (bagNome, valor) => {
    const quantidadeNum = parseInt(valor, 10) || 0; // Converte para número ou 0
    
    setQuantidadesMap(prevMap => ({
      ...prevMap,
      [bagNome]: quantidadeNum, // Define a chave (nome do bag) com o valor
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      /* ✨ 4. MONTA O DTO QUE O BACKEND ESPERA */
      const ordemData = {
        pontoColetaId: pontoColetaId,
        quantidadesEstimadas: quantidadesMap 
      };

      await OrdemServicoService.criarOrdem(ordemData);
      
      onSave(); 
      handleClose();
    } catch (err) {
      setError('Erro ao salvar a ordem de serviço.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    /* ✨ 5. RESETA OS NOVOS ESTADOS */
    setPontoColetaId('');
    setQuantidadesMap({});
    setError('');
    onClose(); 
  };

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
              onChange={(e) => {
                setPontoColetaId(e.target.value);
                setQuantidadesMap({}); // Reseta as quantidades ao trocar o ponto
              }}
              required
            >
              <option value="" disabled>Selecione um ponto</option>
              {pontosColeta.map(ponto => (
                <option key={ponto.id} value={ponto.id}>{ponto.nome}</option>
              ))}
            </select>
          </div>

          {/* ✨ 6. CAMPOS DINÂMICOS APARECEM AQUI */}
          {/* Se um ponto foi selecionado E ele tem 'tiposBag' cadastrados */}
          {pontoSelecionado && pontoSelecionado.tiposBag && pontoSelecionado.tiposBag.length > 0 && (
            <div className="form-group-dynamic-bags">
              <label>Quantidades por Tipo de Bag</label>
              
              {/* Cria um input para cada nome de bag cadastrado no ponto */}
              {pontoSelecionado.tiposBag.map(bagNome => (
                <div key={bagNome} className="dynamic-bag-input">
                  <label htmlFor={bagNome}>{bagNome}</label>
                  <input
                    type="number"
                    id={bagNome}
                    value={quantidadesMap[bagNome] || ''}
                    onChange={(e) => handleQuantidadeChange(bagNome, e.target.value)}
                    min="0"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          )}
          
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