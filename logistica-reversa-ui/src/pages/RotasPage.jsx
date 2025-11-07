// ✨ CÓDIGO NOVO AQUI: logistica-reversa-ui/src/pages/RotasPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import RotaService from '../services/RotaService';
// ✨ ALTERAÇÃO AQUI: Reutiliza o CSS da tabela da página de pontos
import './PontosColetaPage.css'; 

function RotasPage() {
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // ✨ ALTERAÇÃO AQUI: Estado para controlar o loading do botão de aprovar
  const [approvingId, setApprovingId] = useState(null);

  const fetchRotas = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await RotaService.getRotas();
      setRotas(data);
    } catch (err) {
      setError('Falha ao carregar as rotas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRotas();
  }, [fetchRotas]);

  // ✨ ALTERAÇÃO AQUI: Função para lidar com a aprovação
  const handleAprovar = async (rotaId) => {
    setApprovingId(rotaId); // Ativa o loading do botão
    setError('');
    try {
      await RotaService.aprovarRota(rotaId);
      fetchRotas(); // Atualiza a lista após a aprovação
    } catch (err) {
      // Verifica se o erro é de permissão (Forbidden)
      if (err.response && err.response.status === 403) {
        setError('Você não tem permissão para aprovar rotas.');
      } else {
        setError('Erro ao aprovar a rota. Tente novamente.');
      }
    } finally {
      setApprovingId(null); // Desativa o loading
    }
  };

  // Funções auxiliares para formatar os dados na tabela
  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatarValor = (valor) => {
    if (typeof valor !== 'number') {
      return 'R$ 0,00';
    }
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="page-container">
      {/* ✨ ALTERAÇÃO AQUI: O cabeçalho agora só tem o título */}
      <header className="page-header">
        <h1>Gerenciamento de Rotas</h1>
      </header>
      
      {error && <div className="error-message">{error}</div>}

      <div className="content-card">
        <div className="table-container">
          <table>
            {/* ✨ ALTERAÇÃO AQUI: Novas colunas da tabela */}
            <thead>
              <tr>
                <th>Nome da Rota</th>
                <th>Data Criação</th>
                <th>Ordens</th>
                <th>Valor Frete</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="loading-message">Carregando...</td></tr>
              ) : rotas.length > 0 ? (
                rotas.map((rota) => (
                  <tr key={rota.id}>
                    <td>{rota.nomeRota}</td>
                    <td>{formatarData(rota.dataCriacao)}</td>
                    <td>{rota.totalOrdensServico}</td>
                    <td>{formatarValor(rota.valorFrete)}</td>
                    <td>
                      {/* Adiciona classes de estilo para o status (opcional) */}
                      <span className={`status-badge status-${rota.status.toLowerCase()}`}>
                        {rota.status}
                      </span>
                    </td>
                    <td>
                      {/* ✨ ALTERAÇÃO AQUI: Lógica do botão de aprovação */}
                      {rota.status === 'PLANEJADA' && (
                        <button 
                          onClick={() => handleAprovar(rota.id)}
                          disabled={approvingId === rota.id}
                          className="btn btn-primary" // Pode criar um btn-success depois
                        >
                          {approvingId === rota.id ? 'Aprovando...' : 'Aprovar'}
                        </button>
                      )}
                      {rota.status === 'APROVADA' && (
                        <span className="status-aprovada">Aprovada</span>
                      )}
                      {/* Outros status não mostram ação */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="empty-state">Nenhuma rota encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RotasPage;