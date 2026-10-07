import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthContext.jsx';
import { ProtectedRoute, PublicOnlyRoute } from './modules/auth/guards/ProtectedRoute.jsx';
import { LoginPage } from './modules/auth/pages/LoginPage.jsx';
import { DashboardPage } from './modules/dashboard/pages/DashboardPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
