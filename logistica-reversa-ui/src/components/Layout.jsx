// ✨ CÓDIGO ATUALIZADO AQUI
import React from 'react';
/* ✨ 1. Importa o NavLink, o hook useNavigate e o AuthService */
import { NavLink, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './Layout.css';

function Layout({ children }) {
  /* ✨ 2. Inicializa o hook de navegação */
  const navigate = useNavigate();

  /* ✨ 3. Cria a função de logout */
  const handleLogout = () => {
    AuthService.logout(); // Limpa o token do localStorage
    navigate('/login'); // Redireciona para a página de login
  };

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Logística Reversa</h3>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/planejamento" end>Dashboard</NavLink>
          <NavLink to="/pontos-coleta">Pontos de Coleta</NavLink>
          <NavLink to="/rotas">Rotas</NavLink>
          <NavLink to="/relatorios">Relatórios</NavLink>
        </nav>
        <div className="sidebar-footer">
          {/* ✨ 4. Adiciona o onClick ao botão */}
          <button onClick={handleLogout} className="logout-button">Sair</button>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
export default Layout;