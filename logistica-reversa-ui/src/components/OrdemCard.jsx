// ✨ CÓDIGO NOVO AQUI
import React from 'react';
import './OrdemCard.css';

function OrdemCard({ ordem, isSelected, onSelect }) {
  // Pega a primeira letra do nome para o "avatar"
  const inicial = ordem.nomePontoColeta ? ordem.nomePontoColeta.charAt(0).toUpperCase() : '?';

  return (
    <div className={`ordem-card ${isSelected ? 'selected' : ''}`}>
      <div className="card-selection">
        <input 
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(ordem.id)}
        />
      </div>
      <div className="card-avatar">
        <span>{inicial}</span>
      </div>
      <div className="card-details">
        <span className="ponto-coleta-nome">{ordem.nomePontoColeta}</span>
        <p className="ordem-descricao">{ordem.enderecoPontoColeta}</p>
      </div>
      <div className="card-info">
        <span className="status-badge">{ordem.status}</span>
        <span className="data-info">{`Qtd: ${ordem.quantidadeEstimada}`}</span>
      </div>
    </div>
  );
}
export default OrdemCard;