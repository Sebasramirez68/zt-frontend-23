// sessionStorage: el token se borra al cerrar la pestaña (menor ventana de exposición que localStorage).
const KEY = 'zt23.session';

export const tokenStorage = {
  load() {
    try {
      return JSON.parse(sessionStorage.getItem(KEY));
    } catch {
      return null;
    }
  },
  save(session) {
    sessionStorage.setItem(KEY, JSON.stringify(session));
  },
  clear() {
    sessionStorage.removeItem(KEY);
  },
};
