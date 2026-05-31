import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdminGuard() {
  const { user, isReady, isAdmin } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return <div className="admin-loading">Завантаження...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}
