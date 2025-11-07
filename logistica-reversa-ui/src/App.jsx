// ✨ CÓDIGO ATUALIZADO AQUI
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import PlanejamentoRotaPage from './pages/PlanejamentoRotaPage';
import CriarRotaPage from './pages/CriarRotaPage';
import PontosColetaPage from './pages/PontosColetaPage';
/* ✨ ALTERAÇÃO AQUI: Importa a nova página de Rotas que vamos criar */
import RotasPage from './pages/RotasPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LoginPage />} />
      
      {/* --- Rotas que usarão o layout com sidebar --- */}

      <Route 
        path="/planejamento" 
        element={<Layout><PlanejamentoRotaPage /></Layout>} 
      />

      <Route 
        path="/rotas/criar" 
        element={<Layout><CriarRotaPage /></Layout>} 
      />

      <Route 
        path="/pontos-coleta" 
        element={<Layout><PontosColetaPage /></Layout>} 
      />

      {/* ✨ ALTERAÇÃO AQUI: Adiciona a rota para a nova página de Rotas */}
      <Route 
        path="/rotas" 
        element={<Layout><RotasPage /></Layout>} 
      />
      
    </Routes>
  );
}

export default App;