import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminGuard from './AdminGuard';

// Lazy load admin pages for maximum performance isolation
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Orders = React.lazy(() => import('./pages/Orders'));
const Products = React.lazy(() => import('./pages/Products'));
const Payments = React.lazy(() => import('./pages/Payments'));
const Reservations = React.lazy(() => import('./pages/Reservations'));
const Login = React.lazy(() => import('./pages/Login'));

const AdminApp: React.FC = () => {
  return (
    <AdminGuard>
      <Suspense fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-[#0F0F0F]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent"></div>
        </div>
      }>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </AdminGuard>
  );
};

export default AdminApp;
