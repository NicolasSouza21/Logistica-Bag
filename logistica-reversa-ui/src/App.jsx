import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import PlanejamentoRotaPage from './pages/PlanejamentoRotaPage';
import CriarRotaPage from './pages/CriarRotaPage';
/* ✨ ALTERAÇÃO AQUI: Importa a nova página de Pontos de Coleta */
import PontosColetaPage from './pages/PontosColetaPage';

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

      {/* ✨ ALTERAÇÃO AQUI: Adiciona a rota para a página de Pontos de Coleta */}
      <Route 
        path="/pontos-coleta" 
        element={<Layout><PontosColetaPage /></Layout>} 
      />
      
    </Routes>
  );
}

export default App;