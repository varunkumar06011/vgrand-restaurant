import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import ScrollToTop from '@/components/common/ScrollToTop';
import { isConfigured } from '@/db/supabase';
import { AlertCircle, Terminal, RefreshCcw } from 'lucide-react';
import ChatWidget from '@/components/chatbot/ChatWidget';

import routes from './routes';

const AdminApp = React.lazy(() => import('./admin/AdminApp'));

const ConfigError: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-[40px] p-12 text-center relative overflow-hidden backdrop-blur-xl">
        {/* Animated Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/10 rounded-full blur-[100px] animate-pulse" />
        
        <div className="relative z-10">
          <div className="h-20 w-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8">
            <AlertCircle size={40} />
          </div>
          
          <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
            Configuration <span className="text-red-500">Missing</span>
          </h1>
          
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            The royal connection to the database is not established. This happens when environment variables are missing on Vercel.
          </p>

          <div className="space-y-4 text-left bg-black/40 rounded-2xl p-6 border border-white/5 mb-8">
            <div className="flex items-start gap-3">
              <Terminal size={16} className="text-red-400 mt-1 shrink-0" />
              <code className="text-[10px] font-mono text-red-300 break-all">VITE_SUPABASE_URL is missing</code>
            </div>
            <div className="flex items-start gap-3">
              <Terminal size={16} className="text-red-400 mt-1 shrink-0" />
              <code className="text-[10px] font-mono text-red-300 break-all">VITE_SUPABASE_ANON_KEY is missing</code>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 text-center">How to fix this</p>
            <ol className="text-xs text-white/50 space-y-3 text-left list-decimal list-inside">
              <li>Open your <span className="text-white">Vercel Dashboard</span></li>
              <li>Go to <span className="text-white">Settings &gt; Environment Variables</span></li>
              <li>Paste the keys from your local <span className="text-white">.env</span> file</li>
              <li>Redeploy the project</li>
            </ol>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full mt-10 bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all uppercase italic text-sm tracking-widest active:scale-95"
          >
            <RefreshCcw size={18} />
            Retry Connection
          </button>
        </div>
      </div>
    </div>
  );
};

const isDev = import.meta.env.DEV;

const App: React.FC = () => {
  if (!isConfigured && !isDev) {
    return <ConfigError />;
  }

  React.useEffect(() => {
    if (!isConfigured && isDev) {
      toast.error("V Grand: Running in Mock Mode (Keys Missing)", {
        description: "The UI is active for testing, but data features require Supabase keys.",
        duration: 10000,
      });
    }
  }, []);

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
          <ChatWidget />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
