import React from 'react';
import { NavLink } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Logística Reversa</h3>
        </div>
        <nav className="sidebar-nav">
          {/* ✨ ALTERATION HERE: Added 'end' prop for precise active styling */}
          <NavLink to="/planejamento" end>Dashboard</NavLink>

          {/* ✨ ALTERATION HERE: Replaced placeholder with the correct link */}
          <NavLink to="/pontos-coleta">Pontos de Coleta</NavLink>
          
          <NavLink to="/relatorios">Relatórios</NavLink>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button">Sair</button>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
export default Layout;