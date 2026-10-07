import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext.jsx';
import { dashboardService } from '../services/dashboardService.js';
import { BrandMark } from '../../../shared/components/BrandMark.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { Alert } from '../../../shared/components/Alert.jsx';

export function DashboardPage() {
  const { session, logout } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Pide los datos protegidos al backend; el interceptor agrega el token JWT.
  useEffect(() => {
    let active = true;
    dashboardService
      .getData()
      .then((res) => active && setData(res))
      .catch((err) => active && setError(err.message));
    return () => { active = false; };
  }, []);

  return (
    <>
      <header className="topbar">
        <BrandMark />
      </header>

      <main className="dash">
        <Alert>{error}</Alert>
        {!data && !error && <p className="loading">Cargando…</p>}

        {data && (
          <>
            <section className="panel welcome">
              <h1>{data.message}</h1>
              <p>{data.status}. Usuario: <strong>{session.user.username}</strong> · Rol: <strong>{session.user.role}</strong></p>
            </section>

            <section className="panel raw">
              <h2>Respuesta del backend (GET /api/dashboard/data)</h2>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </section>
          </>
        )}
        <Button variant="ghost" onClick={logout}>Cerrar sesión</Button>
      </main>
    </>
  );
}
