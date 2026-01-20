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
    if (polyline && polyline.length > 0) map.fitBounds(polyline);
  }, [polyline, map]);
  return null;
}

function CriarRotaPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [error, setError] = useState('');

  // Dados da rota (agora controlados aqui também)
  const [distanciaTotal, setDistanciaTotal] = useState(state?.distanciaTotal || 'N/A');
  const [duracaoEstimada, setDuracaoEstimada] = useState(state?.duracaoEstimada || 'N/A');
  const [polylineEncoded, setPolylineEncoded] = useState(state?.polyline || null);

  const [valorFrete, setValorFrete] = useState('');

  // ✅ Centro: Bag Cleaner (troque pelo endereço real quando tiver)
  const bagCleaner = useMemo(() => ({
    nome: 'Bag Cleaner (Base)',
    lat: -23.55052,
    lng: -46.633308,
  }), []);

  const [usarRetorno, setUsarRetorno] = useState(true);

  // Custos
  const [custoMotorista, setCustoMotorista] = useState('');
  const [precoDiesel, setPrecoDiesel] = useState('');
  const [kmPorLitro, setKmPorLitro] = useState('');

  const decodedPolyline = useMemo(() => {
    if (polylineEncoded) return decode(polylineEncoded);
    return [];
  }, [polylineEncoded]);

  useEffect(() => {
    if (!state || !state.ordemIds || state.ordemIds.length === 0) {
      navigate('/planejamento');
      return;
    }

    const fetchDetalhesOrdens = async () => {
      try {
        setLoading(true);
        const data = await OrdemServicoService.getOrdensByIds(state.ordemIds);
        // mantém na ordem recebida
        setOrdens(data);
      } catch (err) {
        setError('Não foi possível carregar os detalhes das ordens.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetalhesOrdens();
  }, [state, navigate]);

  const totalBags = useMemo(() => {
    return ordens.reduce((total, ordem) => total + (Number(ordem.quantidadeEstimada) || 0), 0);
  }, [ordens]);

  const moverOrdem = (index, direction) => {
    const novoIndex = index + direction;
    if (novoIndex < 0 || novoIndex >= ordens.length) return;

    const copia = [...ordens];
    const temp = copia[index];
    copia[index] = copia[novoIndex];
    copia[novoIndex] = temp;
    setOrdens(copia);
  };

  const montarListaDeCoordenadas = () => {
    const pontosOrdens = ordens
      .filter(o => o.latitude && o.longitude)
      .map(o => `${o.latitude},${o.longitude}`);

    // origem = Bag Cleaner
    const lista = [`${bagCleaner.lat},${bagCleaner.lng}`, ...pontosOrdens];

    // destino = Bag Cleaner (se usar retorno)
    if (usarRetorno) lista.push(`${bagCleaner.lat},${bagCleaner.lng}`);

    return lista;
  };

  const recalcularRota = async (otimizar) => {
    try {
      setError('');
      const coordenadas = montarListaDeCoordenadas();

      const result = await RotaService.calcularRota({
        coordenadas,
        otimizar, // false = manual, true = otimiza
      });

      setDistanciaTotal(result.distanciaTotal || 'N/A');
      setDuracaoEstimada(result.duracaoEstimada || 'N/A');
      setPolylineEncoded(result.polyline || null);
    } catch (err) {
      setError('Erro ao recalcular rota. Verifique os pontos e tente novamente.');
    }
  };

  const kmDaRota = useMemo(() => {
    // distanciaTotal vem tipo "12.3 km"
    if (!distanciaTotal || distanciaTotal === 'N/A') return 0;
    const num = parseFloat(String(distanciaTotal).replace(',', '.'));
    return Number.isFinite(num) ? num : 0;
  }, [distanciaTotal]);

  const custoDieselEstimado = useMemo(() => {
    const diesel = Number(precoDiesel) || 0;
    const kml = Number(kmPorLitro) || 0;
    if (diesel <= 0 || kml <= 0) return 0;
    const litros = kmDaRota / kml;
    return litros * diesel;
  }, [precoDiesel, kmPorLitro, kmDaRota]);

  const custoTotalEstimado = useMemo(() => {
    const motorista = Number(custoMotorista) || 0;
    return motorista + custoDieselEstimado;
  }, [custoMotorista, custoDieselEstimado]);

  const handleSalvarRota = async () => {
    if (!valorFrete || Number(valorFrete) <= 0) {
      setError('Por favor, insira um valor de frete válido.');
      return;
    }

    setSalvando(true);
    setError('');

    try {
      const criarRotaRequest = {
        ordemIds: state.ordemIds,
        distanciaTotal,
        duracaoEstimada,
        valorFrete: parseFloat(valorFrete),
      };

      await RotaService.criarRotaPlanejada(criarRotaRequest);
      navigate('/rotas');
    } catch (err) {
      setError('Erro ao salvar a rota. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) return <div className="loading-message">Carregando detalhes da rota...</div>;

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
        <span><strong>Total de Bags:</strong> {totalBags}</span>
        <span><strong>Distância:</strong> {distanciaTotal}</span>
        <span><strong>Duração:</strong> {duracaoEstimada}</span>

        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={usarRetorno}
            onChange={(e) => setUsarRetorno(e.target.checked)}
          />
          Voltar para Bag Cleaner
        </label>

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
          />
        </div>

        <div className="header-buttons">
          <button className="btn btn-secondary" onClick={() => recalcularRota(false)}>
            Recalcular (Manual)
          </button>
          <button className="btn btn-primary" onClick={() => recalcularRota(true)}>
            Otimizar
          </button>
        </div>
      </div>

      <div className="rota-info-bar" style={{ marginTop: 10 }}>
        <span><strong>Cálculo de custo</strong></span>

        <div className="form-group-inline">
          <label>Motorista (R$):</label>
          <input type="number" value={custoMotorista} onChange={(e) => setCustoMotorista(e.target.value)} min="0" step="0.01" />
        </div>

        <div className="form-group-inline">
          <label>Diesel (R$/L):</label>
          <input type="number" value={precoDiesel} onChange={(e) => setPrecoDiesel(e.target.value)} min="0" step="0.01" />
        </div>

        <div className="form-group-inline">
          <label>Consumo (km/L):</label>
          <input type="number" value={kmPorLitro} onChange={(e) => setKmPorLitro(e.target.value)} min="0" step="0.1" />
        </div>

        <span><strong>Diesel estimado:</strong> R$ {custoDieselEstimado.toFixed(2)}</span>
        <span><strong>Custo total estimado:</strong> R$ {custoTotalEstimado.toFixed(2)}</span>
      </div>

      <div className="rota-layout">
        <div className="rota-lista-ordens">
          {ordens.map((ordem, idx) => (
            <div key={ordem.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button className="btn btn-secondary" onClick={() => moverOrdem(idx, -1)} disabled={idx === 0}>↑</button>
                <button className="btn btn-secondary" onClick={() => moverOrdem(idx, 1)} disabled={idx === ordens.length - 1}>↓</button>
              </div>

              <div style={{ flex: 1 }}>
                <OrdemCard ordem={ordem} />
              </div>
            </div>
          ))}
        </div>

        <div className="rota-mapa-container">
          <MapContainer center={[bagCleaner.lat, bagCleaner.lng]} zoom={10} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Base Bag Cleaner */}
            <Marker position={[bagCleaner.lat, bagCleaner.lng]}>
              <Popup><strong>{bagCleaner.nome}</strong></Popup>
            </Marker>

            {ordens.map(ordem => (
              (ordem.latitude && ordem.longitude) && (
                <Marker key={ordem.id} position={[ordem.latitude, ordem.longitude]}>
                  <Popup>
                    <strong>{ordem.nomePontoColeta}</strong><br />
                    {ordem.enderecoPontoColeta}
                  </Popup>
                </Marker>
              )
            ))}

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
