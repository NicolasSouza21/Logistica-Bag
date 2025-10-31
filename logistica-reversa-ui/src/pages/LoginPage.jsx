/* ✨ ALTERAÇÃO AQUI */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar o hook useNavigate
import AuthService from '../services/AuthService';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 2. Inicializar o hook

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await AuthService.login(username, password);
      console.log('Login bem-sucedido!', data);
      
      /* ✨ ALTERAÇÃO AQUI: Redirecionamento com o navigate */
      // 3. Em vez do alert, navegamos para a página de planejamento
      navigate('/planejamento'); 

    } catch (err) {
      setError('Falha no login. Verifique seu usuário e senha.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login - Logística Reversa</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="username">Usuário</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;