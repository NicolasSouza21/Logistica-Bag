import React, { useState, useEffect } from 'react';
/* ✨ ALTERAÇÃO AQUI: Corrigido de "react--router-dom" para "react-router-dom" */
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import OrdemServicoService from '../services/OrdemServicoService';
import RotaService from '../services/RotaService';
import OrdemCard from '../components/OrdemCard';
import './CriarRotaPage.css';

function CriarRotaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!state || !state.ordemIds || state.ordemIds.length === 0) {
      navigate('/planejamento');
      return;
    }

    const fetchDetalhesOrdens = async () => {
      try {
        setLoading(true);
        const data = await OrdemServicoService.getOrdensByIds(state.ordemIds);
        setOrdens(data);
      } catch (err) {
        setError('Não foi possível carregar os detalhes das ordens.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetalhesOrdens();
  }, [state, navigate]);

  const handleSalvarRota = async () => {
    setSalvando(true);
    setError('');
    try {
      const criarRotaRequest = {
        ordemIds: state.ordemIds,
        distanciaTotal: state.distanciaTotal,
        duracaoEstimada: state.duracaoEstimada,
      };
      await RotaService.criarRotaPlanejada(criarRotaRequest);
      navigate('/planejamento');
    } catch (err) {
      setError('Erro ao salvar a rota. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };
  
  const posicaoInicialMapa = [-23.55052, -46.633308];

  if (loading) {
    return <div className="loading-message">Carregando detalhes da rota...</div>;
  }
  
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Criar Nova Rota</h1>
        <div className="header-buttons">
          <button onClick={() => navigate('/planejamento')} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={handleSalvarRota} disabled={salvando} className="btn btn-primary">
            {salvando ? 'Salvando...' : 'Salvar Rota Planejada'}
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="rota-info-bar">
        <span><strong>Ordens na Rota:</strong> {ordens.length}</span>
        <span><strong>Distância Estimada:</strong> {state?.distanciaTotal || 'N/A'}</span>
        <span><strong>Duração Estimada:</strong> {state?.duracaoEstimada || 'N/A'}</span>
      </div>

      <div className="rota-layout">
        <div className="rota-lista-ordens">
          {ordens.map(ordem => (
            <OrdemCard key={ordem.id} ordem={ordem} />
          ))}
        </div>
        <div className="rota-mapa-container">
          <MapContainer center={posicaoInicialMapa} zoom={10} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {ordens.map(ordem => 
              (ordem.pontoColeta?.latitude && ordem.pontoColeta?.longitude) && (
                <Marker key={ordem.id} position={[ordem.pontoColeta.latitude, ordem.pontoColeta.longitude]}>
                  <Popup>
                    <strong>{ordem.pontoColeta.nome}</strong><br/>
                    {ordem.pontoColeta.enderecoCompleto}
                  </Popup>
                </Marker>
              )
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default CriarRotaPage;