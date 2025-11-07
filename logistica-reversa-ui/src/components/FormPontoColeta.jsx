// ✨ CÓDIGO ATUALIZADO AQUI
import React, { useState, useEffect } from 'react';
import PontoColetaService from '../services/PontoColetaService';
import './FormPontoColeta.css'; 

function FormPontoColeta({ isOpen, onClose, onSave, pontoParaEditar }) {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [contato, setContato] = useState('');
  
  /* ✨ 1. ALTERAÇÃO AQUI: Mudamos o estado para uma string */
  const [tiposBagString, setTiposBagString] = useState(''); // Era 'tipoBag', agora é uma string

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && pontoParaEditar) {
      setNome(pontoParaEditar.nome || '');
      setEndereco(pontoParaEditar.enderecoCompleto || '');
      setContato(pontoParaEditar.contatoResponsavel || '');
      
      /* ✨ 2. ALTERAÇÃO AQUI: Pegamos a LISTA do backend e transformamos em STRING */
      // O backend envia ['Bag A', 'Bag B'], transformamos em "Bag A, Bag B"
      setTiposBagString(pontoParaEditar.tiposBag ? pontoParaEditar.tiposBag.join(', ') : '');
    } else {
      handleClose(false); 
    }
  }, [isOpen, pontoParaEditar]); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    /* ✨ 3. ALTERAÇÃO AQUI: Convertemos a STRING de volta para uma LISTA */
    // Pega "Bag A, Bag B, ", quebra pela vírgula, limpa espaços e remove itens vazios
    const tiposBagArray = tiposBagString
      .split(',')
      .map(bag => bag.trim()) // Limpa espaços (ex: " Bag A " vira "Bag A")
      .filter(bag => bag.length > 0); // Remove itens vazios (ex: "Bag A,, Bag B")

    const pontoColetaData = {
      nome,
      enderecoCompleto: endereco,
      contatoResponsavel: contato,
      tiposBag: tiposBagArray, // ✨ 4. ALTERAÇÃO AQUI: Enviamos a lista
    };

    try {
      if (pontoParaEditar && pontoParaEditar.id) {
        await PontoColetaService.atualizarPontoColeta(pontoParaEditar.id, pontoColetaData);
      } else {
        await PontoColetaService.criarPontoColeta(pontoColetaData);
      }
      
      onSave(); 
      handleClose(); 
    } catch (err) {
      if (err.response && err.response.status === 403) {
          setError('Você não tem permissão para esta ação.');
      } else {
          setError('Erro ao salvar o ponto de coleta. Verifique os dados.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (deveFecharModal = true) => {
    setNome('');
    setEndereco('');
    setContato('');
    /* ✨ 5. ALTERAÇÃO AQUI: Limpa o estado da string */
    setTiposBagString('');
    setError('');
    if (deveFecharModal) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{pontoParaEditar ? 'Editar Ponto de Coleta' : 'Novo Ponto de Coleta'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome-empresa">Nome da Empresa</label>
            <input
              type="text"
              id="nome-empresa"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endereco">Endereço Completo</label>
            <input
              type="text"
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contato">Pessoa de Contato no Local</label>
            <input
              type="text"
              id="contato"
              value={contato}
              onChange={(e) => setContato(e.target.value)}
              required
            />
          </div>

          {/* ✨ 6. ALTERAÇÃO AQUI: Substituímos o <select> por um <input> */}
          <div className="form-group">
            <label htmlFor="tipo-bag">Tipos de Bag</label>
            <input
              type="text"
              id="tipo-bag"
              value={tiposBagString}
              onChange={(e) => setTiposBagString(e.target.value)}
              placeholder="Ex: Bag Vermelha, Bag Lona, Caixa"
            />
            {/* Adicionamos um texto de ajuda */}
            <small>Separe os nomes dos bags por vírgula (,)</small>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={() => handleClose(true)} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormPontoColeta;