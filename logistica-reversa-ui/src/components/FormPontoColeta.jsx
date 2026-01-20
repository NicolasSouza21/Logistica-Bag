// ✨ CÓDIGO ATUALIZADO AQUI
import React, { useState, useEffect } from 'react';
import PontoColetaService from '../services/PontoColetaService';
import RmService from '../services/RmService'; // ✨ ALTERAÇÃO AQUI: novo service
import './FormPontoColeta.css'; 

function FormPontoColeta({ isOpen, onClose, onSave, pontoParaEditar }) {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [contato, setContato] = useState('');

  // ✨ ALTERAÇÃO AQUI: novos campos para puxar do RM
  const [codCfo, setCodCfo] = useState('');
  const [cidadeColeta, setCidadeColeta] = useState('');
  const [buscandoRm, setBuscandoRm] = useState(false);

  const [tiposBagString, setTiposBagString] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && pontoParaEditar) {
      setNome(pontoParaEditar.nome || '');
      setEndereco(pontoParaEditar.enderecoCompleto || '');
      setContato(pontoParaEditar.contatoResponsavel || '');

      // ✨ ALTERAÇÃO AQUI: caso seu ponto já tenha esses dados salvos no seu banco
      setCodCfo(pontoParaEditar.codCfo || '');
      setCidadeColeta(pontoParaEditar.cidadeColeta || '');

      setTiposBagString(pontoParaEditar.tiposBag ? pontoParaEditar.tiposBag.join(', ') : '');
    } else {
      handleClose(false);
    }
  }, [isOpen, pontoParaEditar]);

  // ✨ ALTERAÇÃO AQUI: função que consulta o RM e preenche o form
  const handleBuscarNoRM = async () => {
    setError('');

    if (!codCfo || codCfo.trim().length === 0) {
      setError('Informe um CODCFO válido para consultar no RM.');
      return;
    }

    if (!/^\d+$/.test(codCfo.trim())) { // ✨ ALTERAÇÃO AQUI
      setError('CODCFO deve conter apenas números.');
      return;
    }

    if (!cidadeColeta || cidadeColeta.trim().length === 0) {
      setError('Informe a CIDADECOLETA (código numérico) para consultar no RM.');
      return;
    }

    if (!/^\d+$/.test(cidadeColeta.trim())) { // ✨ ALTERAÇÃO AQUI
      setError('CIDADECOLETA deve conter apenas números.');
      return;
    }

    setBuscandoRm(true);
    try {
      const dados = await RmService.buscarEnderecoColeta(codCfo.trim(), cidadeColeta.trim());

      // ✅ Preenche nome (prioriza Fantasia, depois Social)
      const nomeRm = dados?.nomeFantasia || dados?.nomeSocial || '';
      if (nomeRm) setNome(nomeRm);

      // ✅ Monta endereço completo de forma consistente
      const rua = dados?.rua || '';
      const numero = dados?.numero || '';
      const bairro = dados?.bairro || '';
      const cidade = dados?.cidadeColeta || dados?.cidade || cidadeColeta; // fallback
      const estado = dados?.estado || '';
      const cep = dados?.cep || '';
      const complemento = dados?.complemento || '';

      const enderecoCompletoMontado = [
        rua && numero ? `${rua}, ${numero}` : rua || '',
        bairro ? `Bairro: ${bairro}` : '',
        complemento ? `Compl.: ${complemento}` : '',
        cidade || estado ? `${cidade}${estado ? ` - ${estado}` : ''}` : '',
        cep ? `CEP: ${cep}` : ''
      ].filter(Boolean).join(' | ');

      if (enderecoCompletoMontado) setEndereco(enderecoCompletoMontado);

      // (Opcional) contato: RM geralmente não tem “contato do local”, então mantemos o que o usuário digitar
      // Se você tiver telefone no RM e quiser preencher, me diga a coluna que eu adapto.

    } catch (err) {
      setError('Não foi possível consultar o RM. Verifique CODCFO/CIDADECOLETA ou a conexão.');
    } finally {
      setBuscandoRm(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const tiposBagArray = tiposBagString
      .split(',')
      .map(bag => bag.trim())
      .filter(bag => bag.length > 0);

    const pontoColetaData = {
      nome,
      enderecoCompleto: endereco,
      contatoResponsavel: contato,
      tiposBag: tiposBagArray,

      // ✨ ALTERAÇÃO AQUI: envia também os dados do RM (se seu backend aceitar)
      codCfo: codCfo?.trim() || null,
      cidadeColeta: cidadeColeta?.trim() || null,
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
    setTiposBagString('');

    // ✨ ALTERAÇÃO AQUI: limpa RM fields
    setCodCfo('');
    setCidadeColeta('');
    setBuscandoRm(false);

    setError('');
    if (deveFecharModal) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{pontoParaEditar ? 'Editar Ponto de Coleta' : 'Novo Ponto de Coleta'}</h2>

        <form onSubmit={handleSubmit}>

          {/* ✨ ALTERAÇÃO AQUI: Bloco RM */}
          <div className="form-group">
            <label htmlFor="codcfo">CODCFO (RM)</label>
            <input
              type="text"
              id="codcfo"
              value={codCfo}
              onChange={(e) => {
                // ✨ ALTERAÇÃO AQUI: somente números (mantém zeros à esquerda)
                const onlyNumbers = e.target.value.replace(/\D/g, '');
                setCodCfo(onlyNumbers);
              }}
              placeholder="Ex: 001483"
              inputMode="numeric"      // ✨ ALTERAÇÃO AQUI
              pattern="[0-9]*"          // ✨ ALTERAÇÃO AQUI
              disabled={loading || buscandoRm}
            />
            <small>Informe o código numérico do CODCFO (RM).</small>
          </div>

          <div className="form-group">
            <label htmlFor="cidadecoleta">Cidade de Coleta (RM)</label>
            <input
              type="text"
              id="cidadecoleta"
              value={cidadeColeta}
              onChange={(e) => {
                // ✨ ALTERAÇÃO AQUI: somente números (mantém zeros à esquerda)
                const onlyNumbers = e.target.value.replace(/\D/g, '');
                setCidadeColeta(onlyNumbers);
              }}
              placeholder="Ex: 00080"
              inputMode="numeric"      // ✨ ALTERAÇÃO AQUI
              pattern="[0-9]*"          // ✨ ALTERAÇÃO AQUI
              disabled={loading || buscandoRm}
            />
            <small>Use o código numérico da cidade operacional (CIDADECOLETA).</small>
          </div>

          <div className="modal-actions" style={{ justifyContent: 'flex-start', gap: 10 }}>
            <button
              type="button"
              onClick={handleBuscarNoRM}
              className="btn-secondary"
              disabled={loading || buscandoRm}
            >
              {buscandoRm ? 'Buscando no RM...' : 'Buscar no RM'}
            </button>
          </div>

          <hr style={{ margin: '14px 0', opacity: 0.3 }} />

          <div className="form-group">
            <label htmlFor="nome-empresa">Nome da Empresa</label>
            <input
              type="text"
              id="nome-empresa"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo-bag">Tipos de Bag</label>
            <input
              type="text"
              id="tipo-bag"
              value={tiposBagString}
              onChange={(e) => setTiposBagString(e.target.value)}
              placeholder="Ex: Bag Vermelha, Bag Lona, Caixa"
              disabled={loading}
            />
            <small>Separe os nomes dos bags por vírgula (,)</small>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={() => handleClose(true)} className="btn-secondary" disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading || buscandoRm}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default FormPontoColeta;
