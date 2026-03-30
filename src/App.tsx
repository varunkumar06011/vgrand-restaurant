import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import ScrollToTop from '@/components/common/ScrollToTop';

import routes from './routes';

const AdminApp = React.lazy(() => import('./admin/AdminApp'));

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <IntersectObserver />
          <Routes>
            {/* Admin routes are isolated from MainLayout */}
            <Route path="/admin/*" element={<AdminApp />} />
            
            {/* Guest routes are wrapped in MainLayout */}
            <Route path="*" element={
              <MainLayout>
                <Routes>
                  {routes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            } />
          </Routes>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
