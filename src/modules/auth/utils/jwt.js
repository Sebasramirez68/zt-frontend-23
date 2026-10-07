// Solo LEE el payload para saber cuándo expira. La validación real (firma) siempre la hace el backend.
export function decodeJwtPayload(token) {
  try {
    const part = token.split('.')[1];
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isExpired(token) {
  const payload = decodeJwtPayload(token);
  return !payload?.exp || payload.exp * 1000 <= Date.now();
}
