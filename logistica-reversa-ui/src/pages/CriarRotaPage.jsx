// ✨ CÓDIGO ATUALIZADO AQUI
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { decode } from '@googlemaps/polyline-codec'; 
import OrdemServicoService from '../services/OrdemServicoService';
import RotaService from '../services/RotaService';
import OrdemCard from '../components/OrdemCard';
import './CriarRotaPage.css';
import '../components/FormPontoColeta.css';

function FitBoundsToPolyline({ polyline }) {
  const map = useMap(); 
  useEffect(() => {
    if (polyline && polyline.length > 0) {
      map.fitBounds(polyline); 
    }
  }, [polyline, map]);
  return null; 
}

function CriarRotaPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const [ordens, setOrdens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [valorFrete, setValorFrete] = useState('');

    const decodedPolyline = useMemo(() => {
        if (state?.polyline) {
            return decode(state.polyline);
        }
        return [];
    }, [state?.polyline]);

    useEffect(() => {
        if (!state || !state.ordemIds || state.ordemIds.length === 0) {
            navigate('/planejamento');
            return;
        }

        const fetchDetalhesOrdens = async () => {
            try {
                setLoading(true);
                // Assumindo que o método no service JS se chama 'getOrdensByIds'
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
        if (!valorFrete || parseFloat(valorFrete) <= 0) {
            setError('Por favor, insira um valor de frete válido.');
            return;
        }

        setSalvando(true);
        setError('');
        try {
            const criarRotaRequest = {
                ordemIds: state.ordemIds,
                distanciaTotal: state.distanciaTotal,
                duracaoEstimada: state.duracaoEstimada,
                valorFrete: parseFloat(valorFrete)
            };
            await RotaService.criarRotaPlanejada(criarRotaRequest);
            navigate('/rotas'); // Ajuste: talvez você queira ir para /planejamento?
        } catch (err) {
            setError('Erro ao salvar a rota. Tente novamente.');
        } finally {
            setSalvando(false);
        }
    };
    
    const posicaoInicialMapa = [-23.55052, -46.633308]; 

    /* ✨ 1. ALTERAÇÃO AQUI: Calcula o total de bags */
    const totalBags = ordens.reduce((total, ordem) => {
      // Soma o total + a quantidadeEstimada de cada ordem
      return total + (Number(ordem.quantidadeEstimada) || 0);
    }, 0); // Começa a soma do 0

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
                
                {/* ✨ 2. ALTERAÇÃO AQUI: Adiciona o total de bags na barra */}
                <span><strong>Total de Bags:</strong> {totalBags}</span>
                
                <span><strong>Distância Estimada:</strong> {state?.distanciaTotal || 'N/A'}</span>
                <span><strong>Duração Estimada:</strong> {state?.duracaoEstimada || 'N/A'}</span>
                <div className="form-group-inline"> 
                    <label htmlFor="valor-frete">Valor do Frete (R$):</label>
                    <input
                        type="number"
                        id="valor-frete"
                        value={valorFrete}
                        onChange={(e) => setValorFrete(e.target.value)}
                        placeholder="Ex: 150.00"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
            </div>

            <div className="rota-layout">
                <div className="rota-lista-ordens">
                    {ordens.map(ordem => (
                        <OrdemCard 
                            key={ordem.id} 
                            ordem={ordem} 
                            // isSelected e onSelect não são necessários aqui
                        />
                    ))}
                </div>
                <div className="rota-mapa-container">
                    <MapContainer center={posicaoInicialMapa} zoom={10} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        {ordens.map(ordem => 
                            (ordem.latitude && ordem.longitude) && ( 
                                <Marker key={ordem.id} position={[ordem.latitude, ordem.longitude]}>
                                    <Popup>
                                        <strong>{ordem.nomePontoColeta}</strong><br/>
                                        {ordem.enderecoPontoColeta}
                                    </Popup>
                                </Marker>
                            )
                        )}

                        {decodedPolyline.length > 0 && (
                            <Polyline pathOptions={{ color: 'blue', weight: 5 }} positions={decodedPolyline} />
                        )}

                        <FitBoundsToPolyline polyline={decodedPolyline} />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default CriarRotaPage;