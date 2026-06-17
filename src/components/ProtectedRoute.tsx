import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { ROLE_ROUTE_ACCESS } from '../constants/rbac';

export function ProtectedRoute() {
  const { session } = useAppContext();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const allowedRoutes = ROLE_ROUTE_ACCESS[session.role];
  const hasAccess = allowedRoutes.some((path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`),
  );

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
