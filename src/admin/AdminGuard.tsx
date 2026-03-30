import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0F0F0F]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent"></div>
      </div>
    );
  }

  // Feature Flag Check
  const isAdminEnabled = import.meta.env.VITE_ADMIN_ENABLED === 'true';
  const isLoginPage = location.pathname === '/admin/login';

  if (!isAdminEnabled) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isLoginPage) {
    return user && profile?.role === 'admin' ? <Navigate to="/admin" replace /> : <>{children}</>;
  }

  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
