import React, { useState, useEffect, useCallback } from 'react';
import PontoColetaService from '../services/PontoColetaService';
/* ✨ ALTERAÇÃO AQUI: Importa o formulário que já criamos */
import FormPontoColeta from '../components/FormPontoColeta';
import './PontosColetaPage.css';

function PontosColetaPage() {
  const [pontosColeta, setPontosColeta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para buscar os dados da API
  const fetchPontosColeta = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await PontoColetaService.getPontosDeColeta();
      setPontosColeta(data);
    } catch (err) {
      setError('Falha ao carregar os pontos de coleta.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca os dados quando a página carrega pela primeira vez
  useEffect(() => {
    fetchPontosColeta();
  }, [fetchPontosColeta]);

  const handleSaveSuccess = () => {
    setIsModalOpen(false);
    fetchPontosColeta(); // Atualiza a lista após um novo cadastro
  };

  return (
    <div className="page-container">
      {/* ✨ ALTERAÇÃO AQUI: O modal de formulário agora está ativo */}
      <FormPontoColeta 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSuccess}
      /> 

      <header className="page-header">
        <h1>Pontos de Coleta</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          + Novo Ponto de Coleta
        </button>
      </header>
      
      {error && <div className="error-message">{error}</div>}

      <div className="content-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome da Empresa</th>
                <th>Endereço</th>
                <th>Contato no Local</th>
                <th>Tipo de Bag</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="loading-message">Carregando...</td></tr>
              ) : pontosColeta.length > 0 ? (
                pontosColeta.map((ponto) => (
                  <tr key={ponto.id}>
                    <td>{ponto.nome}</td>
                    <td>{ponto.enderecoCompleto}</td>
                    <td>{ponto.contatoResponsavel}</td>
                    <td>{ponto.tipoBag}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="empty-state">Nenhum ponto de coleta cadastrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PontosColetaPage;