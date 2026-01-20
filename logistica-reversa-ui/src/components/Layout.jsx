// ✨ CÓDIGO ATUALIZADO AQUI
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './Layout.css';

function Layout({ children }) {
  const navigate = useNavigate();

  // ✨ ALTERAÇÃO AQUI: controla sidebar no mobile/tablet
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <div className="layout-container">
      {/* ✨ ALTERAÇÃO AQUI: topbar só aparece em telas menores */}
      <header className="topbar">
        <button
          className="icon-button"
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Abrir menu"
        >
          ☰
        </button>

        <div className="topbar-title">
          <span className="topbar-mark" aria-hidden="true">♻️</span>
          <span className="topbar-text">Logística Reversa</span>
        </div>

        <button onClick={handleLogout} className="topbar-logout" type="button" aria-label="Sair">
          🚪
        </button>
      </header>

      {/* ✨ ALTERAÇÃO AQUI: overlay para fechar menu */}
      <button
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        type="button"
        onClick={() => setIsSidebarOpen(false)}
        aria-label="Fechar menu"
      />

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">♻️</div>
            <div className="brand-text">
              <h3>Logística Reversa</h3>
              <p>Painel Operacional</p>
            </div>
          </div>

          {/* ✨ ALTERAÇÃO AQUI: botão fechar no mobile */}
          <button
            className="close-button"
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav" onClick={() => setIsSidebarOpen(false)}>
          <NavLink to="/planejamento" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon" aria-hidden="true">📊</span>
            <span className="nav-text">Dashboard</span>
          </NavLink>

          <NavLink to="/pontos-coleta" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon" aria-hidden="true">📍</span>
            <span className="nav-text">Pontos de Coleta</span>
          </NavLink>

          <NavLink to="/rotas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon" aria-hidden="true">🗺️</span>
            <span className="nav-text">Rotas</span>
          </NavLink>

          <NavLink to="/relatorios" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon" aria-hidden="true">📄</span>
            <span className="nav-text">Relatórios</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button" type="button">
            <span aria-hidden="true">🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* ✨ ALTERAÇÃO AQUI: wrapper para controlar padding conforme largura */}
      <main className="main-content">
        <div className="content-wrap">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
