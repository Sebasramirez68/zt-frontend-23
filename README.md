# zt-frontend-23 · Frontend modular en React

Frontend de la práctica *Implementación de una aplicación web segura bajo un enfoque Zero Trust en AWS*.
Se sirve con Nginx desde **EC2-Frontend (10.23.1.10)** en **VPC-Frontend-23 (10.23.1.0/24)**, por HTTPS
con certificado de Let's Encrypt. Nginx reenvía `/api/*` al backend privado (10.23.2.10:3000) por el VPC Peering.

## Arquitectura modular basada en componentes

```
src/
├── modules/
│   ├── auth/                    # Todo lo de autenticación, aislado
│   │   ├── components/LoginForm.jsx
│   │   ├── context/AuthContext.jsx   # Estado de sesión, login/logout, cierre automático al expirar el JWT
│   │   ├── guards/ProtectedRoute.jsx # Rutas protegidas y rutas solo-públicas
│   │   ├── pages/LoginPage.jsx
│   │   ├── services/authService.js   # Llamada a POST /api/auth/login
│   │   ├── services/tokenStorage.js  # sessionStorage
│   │   └── utils/jwt.js              # Lee "exp" del token (la firma la valida el backend)
│   └── dashboard/               # Vista protegida
│       ├── pages/DashboardPage.jsx
│       └── services/dashboardService.js
├── shared/                      # Reutilizable por cualquier módulo
│   ├── api/httpClient.js        # Interceptor: agrega Authorization: Bearer y maneja 401
│   ├── components/              # Button, TextField, Alert, BrandMark
│   └── styles/global.css
├── App.jsx                      # Rutas
└── main.jsx
```

- **Separación de responsabilidades:** las páginas componen, los componentes muestran, los servicios hablan con la API y el contexto guarda el estado de sesión.
- **Componentes reutilizables:** `shared/components` no sabe nada de autenticación ni del dashboard.
- **Zero Trust en el cliente:** el frontend no decide quién es válido; solo envía el token y obedece al backend. Si el backend responde 401, la sesión se cierra.
- **Compatible con CSP estricta:** sin scripts ni estilos inline y sin recursos externos (permite `default-src 'self'`).

## Ejecutar en local (con el backend corriendo en el puerto 3000)

```bash
npm install
npm run dev          # http://localhost:5173
```

Las credenciales de prueba se entregan por separado.

## Compilar y subir

```bash
npm run build        # genera dist/
git add . && git commit -m "build" && git push
```

La carpeta `dist/` **sí se sube** al repositorio: el servidor la copia tal cual, sin compilar en la instancia.

## Despliegue (carpeta deploy/)

- `user-data.sh`: se pega en *User data* al lanzar la EC2 (rellena REPO, DOMAIN y datos de DuckDNS).
- `nginx/zt-frontend.conf`: sitio, proxy `/api/` y encabezados de seguridad.
- `fail2ban/`: jails `sshd` y `nginx-login` (bloqueo tras 5 logins fallidos en 5 min, por 10 min).
