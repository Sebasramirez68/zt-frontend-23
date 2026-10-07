// Interceptor de API: inyecta "Authorization: Bearer <token>" en cada petición
// y cierra la sesión si el backend rechaza el token (401).
let getToken = () => null;
let onUnauthorized = () => {};

export function configureHttpClient(options) {
  getToken = options.getToken;
  onUnauthorized = options.onUnauthorized;
}

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function http(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: 'same-origin',
    });
  } catch {
    throw new HttpError(0, 'No se pudo conectar con el servidor.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && auth) onUnauthorized();
    throw new HttpError(response.status, data.error || `Error ${response.status}`);
  }
  return data;
}
