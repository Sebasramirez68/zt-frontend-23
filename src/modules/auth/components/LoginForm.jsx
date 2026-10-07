import { useState } from 'react';
import { TextField } from '../../../shared/components/TextField.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { Alert } from '../../../shared/components/Alert.jsx';

function messageFor(err) {
  if (err.status === 401) return 'Usuario o contraseña incorrectos.';
  if (err.status === 400) return err.message;
  if (err.status === 0) {
    return 'No se pudo conectar con el servidor. Si fallaste varios intentos seguidos, tu IP puede estar bloqueada temporalmente.';
  }
  return 'No se pudo iniciar sesión. Intenta de nuevo.';
}

export function LoginForm({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(username.trim(), password);
    } catch (err) {
      setError(messageFor(err));
      setPassword('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login__form" onSubmit={handleSubmit} noValidate>
      <TextField
        label="Usuario"
        name="username"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        maxLength={50}
      />
      <TextField
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        maxLength={128}
      />
      <Alert>{error}</Alert>
      <Button type="submit" loading={loading} disabled={!username || !password}>
        {loading ? 'Verificando…' : 'Iniciar sesión'}
      </Button>
    </form>
  );
}
