// ✨ CÓDIGO ATUALIZADO AQUI
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PontoColetaService from '../services/PontoColetaService';
import FormPontoColeta from '../components/FormPontoColeta';
import './PontosColetaPage.css';

function PontosColetaPage() {
  const [pontosColeta, setPontosColeta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ✨ 1. Estado para o filtro de busca */
  const [filtroNome, setFiltroNome] = useState('');
  /* ✨ 2. Estado para controlar qual ponto está sendo editado */
  const [pontoParaEditar, setPontoParaEditar] = useState(null);

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

  useEffect(() => {
    fetchPontosColeta();
  }, [fetchPontosColeta]);

  const handleSaveSuccess = () => {
    setIsModalOpen(false);
    setPontoParaEditar(null); // Limpa o estado de edição
    fetchPontosColeta(); // Atualiza a lista
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPontoParaEditar(null); // Limpa o estado de edição ao fechar
  };

  /* ✨ 3. Funções para abrir o modal em modo Criação ou Edição */
  const handleAbrirParaCriar = () => {
    setPontoParaEditar(null); // Garante que está nulo (modo criação)
    setIsModalOpen(true);
  };

  const handleAbrirParaEditar = (ponto) => {
    setPontoParaEditar(ponto); // Define o ponto (modo edição)
    setIsModalOpen(true);
  };

  /* ✨ 4. Função para Deletar com confirmação */
  const handleDeletar = async (ponto) => {
    if (window.confirm(`Tem certeza que deseja excluir o ponto "${ponto.nome}"?`)) {
      try {
        await PontoColetaService.deletarPontoColeta(ponto.id);
        fetchPontosColeta(); // Atualiza a lista
      } catch (err) {
        if (err.response && err.response.status === 403) {
            setError('Você não tem permissão para excluir pontos.');
        } else {
            setError('Erro ao excluir o ponto. Verifique se ele não está sendo usado em ordens de serviço.');
        }
      }
    }
  };

  /* ✨ 5. Lógica de filtro (que havíamos feito antes) */
  const pontosFiltrados = useMemo(() => {
    if (!filtroNome) {
      return pontosColeta;
    }
    return pontosColeta.filter(ponto =>
      ponto.nome.toLowerCase().includes(filtroNome.toLowerCase())
    );
  }, [pontosColeta, filtroNome]);

  return (
    <div className="page-container">
      {/* ✨ 6. Passa o 'pontoParaEditar' para o formulário */}
      <FormPontoColeta 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSuccess}
        pontoParaEditar={pontoParaEditar}
      /> 

      <header className="page-header">
        <h1>Pontos de Coleta</h1>
        
        {/* Campo de busca */}
        <input
          type="text"
          placeholder="Buscar por nome da empresa..."
          className="page-header-search-input"
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
        />

        {/* ✨ 7. Botão agora chama a função correta */}
        <button onClick={handleAbrirParaCriar} className="btn btn-primary">
          + Novo Ponto de Coleta
        </button>
      </header>
      
      {error && <div className="error-message" onClick={() => setError('')}>{error} (clique para fechar)</div>}

      <div className="content-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome da Empresa</th>
                <th>Endereço</th>
                <th>Contato no Local</th>
                <th>Tipo de Bag</th>
                <th>AÇÕES</th> {/* ✨ 8. Nova coluna de Ações */}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="loading-message">Carregando...</td></tr>
              ) : pontosFiltrados.length > 0 ? (
                pontosFiltrados.map((ponto) => (
                  <tr key={ponto.id}>
                    <td>{ponto.nome}</td>
                    <td>{ponto.enderecoCompleto}</td>
                    <td>{ponto.contatoResponsavel}</td>
                    <td>{ponto.tipoBag}</td>
                    {/* ✨ 9. Célula com os botões de Ação */}
                    <td className="td-actions">
                      <button 
                        onClick={() => handleAbrirParaEditar(ponto)} 
                        className="btn-action btn-edit"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDeletar(ponto)}
                        className="btn-action btn-delete"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    {pontosColeta.length === 0 
                      ? "Nenhum ponto de coleta cadastrado." 
                      : "Nenhum ponto de coleta encontrado com esse nome."
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PontosColetaPage;