/* ✨ ALTERAÇÃO AQUI */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false); // ✨ ALTERAÇÃO AQUI: mostrar/ocultar senha
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // ✨ ALTERAÇÃO AQUI: foco automático no usuário
  const usernameRef = useRef(null);
  useEffect(() => {
    if (usernameRef.current) usernameRef.current.focus();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await AuthService.login(username, password);
      console.log('Login bem-sucedido!', data);

      navigate('/planejamento');
    } catch (err) {
      setError('Falha no login. Verifique seu usuário e senha.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      {/* ✨ ALTERAÇÃO AQUI: card central com branding */}
      <div className="login-card">
        <div className="login-brand">
          <div className="login-mark" aria-hidden="true">♻️</div>
          <div className="login-brand-text">
            <h1>Logística Reversa</h1>
            <p>Acesse o painel operacional</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-head">
            <h2>Entrar</h2>
            <p>Use suas credenciais para continuar.</p>
          </div>

          {error && (
            <div className="login-alert" role="alert">
              ⚠️ {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="username">Usuário</label>
            <input
              ref={usernameRef}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
              placeholder="Seu usuário"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>

            {/* ✨ ALTERAÇÃO AQUI: input com botão de mostrar/ocultar */}
            <div className="password-field">
              <input
                type={showPass ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                placeholder="Sua senha"
              />

              <button
                type="button"
                className="ghost-button"
                onClick={() => setShowPass((v) => !v)}
                disabled={loading}
                aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                title={showPass ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? (
              <span className="loading-inline">
                <span className="spinner" aria-hidden="true" />
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>

          {/* ✨ ALTERAÇÃO AQUI: rodapé discreto */}
          <p className="login-footnote">
            Se você não tiver acesso, fale com o administrador.
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
