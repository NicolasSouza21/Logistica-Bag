// ✨ CÓDIGO NOVO E COMPLETO AQUI
import React, { useState } from 'react';
import PontoColetaService from '../services/PontoColetaService';
import './FormPontoColeta.css'; // Usaremos um CSS similar ao outro modal

function FormPontoColeta({ isOpen, onClose, onSave }) {
  // Estados para cada campo do formulário
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [contato, setContato] = useState('');
  const [tipoBag, setTipoBag] = useState('PADRAO'); // Valor inicial padrão

  // Estados de controle do formulário
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Monta o objeto com os dados para enviar à API
    const pontoColetaData = {
      nome,
      enderecoCompleto: endereco,
      contatoResponsavel: contato,
      tipoBag,
    };

    try {
      await PontoColetaService.criarPontoColeta(pontoColetaData);
      onSave(); // Avisa o componente pai que o item foi salvo
      handleClose(); // Fecha e limpa o modal
    } catch (err) {
      setError('Erro ao salvar o ponto de coleta. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Limpa todos os campos ao fechar o modal
    setNome('');
    setEndereco('');
    setContato('');
    setTipoBag('PADRAO');
    setError('');
    onClose(); // Chama a função onClose passada pelo pai
  };

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Novo Ponto de Coleta</h2>
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
          <div className="form-group">
            <label htmlFor="tipo-bag">Tipo de Bag Principal</label>
            <select
              id="tipo-bag"
              value={tipoBag}
              onChange={(e) => setTipoBag(e.target.value)}
              required
            >
              <option value="PADRAO">Padrão</option>
              <option value="GRANDE">Grande</option>
              <option value="REFRIGERADO">Refrigerado</option>
              <option value="ESPECIAL">Especial</option>
            </select>
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

export default FormPontoColeta;