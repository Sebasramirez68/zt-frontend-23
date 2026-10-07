import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LoginForm } from '../components/LoginForm.jsx';
import { BrandMark } from '../../../shared/components/BrandMark.jsx';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(username, password) {
    await login(username, password);
    navigate('/dashboard', { replace: true });
  }

  return (
    <main className="login">
      <div className="login__card">
        <BrandMark />
        <div>
          <h1>Inicia sesión</h1>
          <p>Ingresa tu usuario y contraseña.</p>
        </div>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </main>
  );
}
