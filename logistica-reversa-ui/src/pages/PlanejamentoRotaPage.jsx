// ✨ ARQUIVO ATUALIZADO AQUI
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
      // O DTO que vem daqui agora inclui latitude e longitude
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

    /* ✨ ALTERAÇÃO AQUI: Mapeia as coordenadas exatas em vez dos endereços */
    const ordensParaRota = ordens.filter((ordem) => ordensSelecionadas.has(ordem.id));

    // Validação: Garante que todos os pontos selecionados têm coordenadas
    // (Protege contra dados antigos cadastrados antes da correção do geocoding)
    const ordensInvalidas = ordensParaRota.filter((ordem) => !ordem.latitude || !ordem.longitude);

    if (ordensInvalidas.length > 0) {
      setError(
        `Erro: A ordem "${ordensInvalidas[0].nomePontoColeta}" não possui coordenadas. Cadastre o ponto de coleta novamente.`
      );
      setCalculandoRota(false);
      return;
    }

    // Mapeia para a lista de strings "lat,lng" que o backend espera
    const coordenadas = ordensParaRota.map((ordem) => `${ordem.latitude},${ordem.longitude}`);

    try {
      /* ✨ ALTERAÇÃO AQUI: Envia o objeto { coordenadas: [...] } */
      const resultado = await RotaService.calcularRota({ coordenadas });

      // Navega para a página de criação com todos os dados corretos
      navigate('/rotas/criar', {
        state: {
          ordemIds: idsSelecionados,
          distanciaTotal: resultado.distanciaTotal,
          duracaoEstimada: resultado.duracaoEstimada,
          polyline: resultado.polyline, // A linha do mapa
        },
      });
    } catch (err) {
      setError('Erro ao calcular a rota. Tente novamente.');
    } finally {
      setCalculandoRota(false);
    }
  };

  return (
    <div className="page-container">
      <FormNovaColeta isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveSuccess} />

      {/* ✨ ALTERAÇÃO AQUI: Header mais “dashboard”: título + subtítulo + ações alinhadas */}
      <header className="page-header">
        <div className="page-title">
          <p className="page-eyebrow">Logística Reversa</p>
          <h1>Painel de Planejamento</h1>
          <p className="page-subtitle">Selecione coletas pendentes para montar uma rota otimizada.</p>
        </div>

        <div className="page-actions">
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-pill">
            + Nova Coleta
          </button>
        </div>
      </header>

      {/* ✨ ALTERAÇÃO AQUI: KPIs com ícones e melhor hierarquia */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-warn" aria-hidden="true">📌</div>
          <div className="kpi-body">
            <span className="kpi-title">Chamados Abertos</span>
            <span className="kpi-value">{ordens.length}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-info" aria-hidden="true">🚚</div>
          <div className="kpi-body">
            <span className="kpi-title">Rotas em Andamento</span>
            <span className="kpi-value">0</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-ok" aria-hidden="true">📅</div>
          <div className="kpi-body">
            <span className="kpi-title">Coletas Hoje</span>
            <span className="kpi-value">0</span>
          </div>
        </div>
      </div>

      {/* ✨ ALTERAÇÃO AQUI: Card principal com toolbar/ações mais “clean” */}
      <div className="content-card">
        <div className="card-header">
          <div className="card-title">
            <h2>Chamados: Pendentes</h2>
            <span className="card-badge">{ordens.length}</span>
          </div>

          <div className="rota-calculator">
            <button
              onClick={handleCalcularRota}
              disabled={ordensSelecionadas.size < 2 || calculandoRota}
              className="btn btn-secondary btn-pill"
              title={ordensSelecionadas.size < 2 ? 'Selecione ao menos 2 coletas' : 'Criar rota'}
            >
              {calculandoRota ? 'Calculando...' : `Criar Rota (${ordensSelecionadas.size})`}
            </button>
          </div>
        </div>

        {/* ✨ ALTERAÇÃO AQUI: mensagens com estilo de alerta */}
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {loading && <div className="alert alert-loading">⏳ Carregando...</div>}

        {!loading && ordens.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">🧺</div>
            <div className="empty-text">
              <h3>Nenhuma coleta pendente</h3>
              <p>Crie uma nova coleta para começar a montar rotas.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-pill">
              + Nova Coleta
            </button>
          </div>
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
