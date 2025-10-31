// ✨ ARQUIVO ATUALIZADO com os containers de KPI

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import OrdemServicoService from '../services/OrdemServicoService';
import RotaService from '../services/RotaService';
import FormNovaColeta from '../components/FormNovaColeta';
import OrdemCard from '../components/OrdemCard';
import './PlanejamentoRotaPage.css';

function PlanejamentoRotaPage() {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ordensSelecionadas, setOrdensSelecionadas] = useState(new Set());
  const [calculandoRota, setCalculandoRota] = useState(false);
  
  const navigate = useNavigate();

  const fetchOrdens = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await OrdemServicoService.getOrdensPorStatus('PENDENTE');
      setOrdens(data);
    } catch (err) {
      setError('Falha ao carregar as ordens de serviço.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdens();
  }, [fetchOrdens]);

  const handleSaveSuccess = () => {
    setIsModalOpen(false);
    fetchOrdens();
  };
  
  const handleSelecionarOrdem = (ordemId) => {
    const novasSelecoes = new Set(ordensSelecionadas);
    novasSelecoes.has(ordemId) ? novasSelecoes.delete(ordemId) : novasSelecoes.add(ordemId);
    setOrdensSelecionadas(novasSelecoes);
  };

  const handleCalcularRota = async () => {
    setCalculandoRota(true);
    setError('');

    const idsSelecionados = Array.from(ordensSelecionadas);
    const enderecos = ordens
      .filter(ordem => ordensSelecionadas.has(ordem.id))
      .map(ordem => ordem.enderecoPontoColeta);
      
    try {
      const resultado = await RotaService.calcularRota(enderecos);
      
      navigate('/rotas/criar', { 
        state: { 
          ordemIds: idsSelecionados,
          distanciaTotal: resultado.distanciaTotal,
          duracaoEstimada: resultado.duracaoTotal,
        } 
      });

    } catch (err) {
      setError('Erro ao calcular a rota. Verifique os endereços e tente novamente.');
    } finally {
      setCalculandoRota(false);
    }
  };

  return (
    <div className="page-container">
      <FormNovaColeta isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveSuccess} />

      <header className="page-header">
        <h1>Painel de Planejamento</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">+ Nova Coleta</button>
      </header>

      {/*
        -- ✨ CONTAINERS ADICIONADOS AQUI --
        Este é o grid que cria a divisão para os cartões de indicadores,
        cada um com sua própria sombra e estilo.
      */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-title">Chamados Abertos</span>
          <span className="kpi-value">{ordens.length}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">Rotas em Andamento</span>
          <span className="kpi-value">0</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">Coletas Hoje</span>
          <span className="kpi-value">0</span>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h2>Chamados: Pendentes ({ordens.length})</h2>
          <div className="rota-calculator">
            <button 
              onClick={handleCalcularRota} 
              disabled={ordensSelecionadas.size < 2 || calculandoRota} 
              className="btn btn-secondary"
            >
              {calculandoRota ? 'Calculando...' : `Criar Rota (${ordensSelecionadas.size})`}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">Carregando...</div>}
        
        {!loading && ordens.length === 0 && (
          <div className="empty-state">Nenhuma coleta pendente encontrada.</div>
        )}

        <div className="ordem-list">
          {ordens.map((ordem) => (
            <OrdemCard
              key={ordem.id}
              ordem={ordem}
              isSelected={ordensSelecionadas.has(ordem.id)}
              onSelect={handleSelecionarOrdem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlanejamentoRotaPage;