import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthorization } from '../../hooks/useAuthorization';
import { useAuth } from '../../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { can, loading: roleLoading } = useAuthorization();
  
  // Show loading state while checking auth and role
  if (authLoading || roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if not admin
  if (!can('viewAdminDashboard')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default AdminRoute; 