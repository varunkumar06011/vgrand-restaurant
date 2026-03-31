import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  CreditCard,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Reservations', path: '/admin/reservations', icon: CalendarDays },
  { name: 'Products', path: '/admin/products', icon: UtensilsCrossed },
  { name: 'Payments', path: '/admin/payments', icon: CreditCard },
];

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { signOut, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0F0F0F] text-white">
      {/* Mobile Notice */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-[#D4AF37] p-2 text-center text-xs font-bold text-black flex items-center justify-center gap-2">
          <AlertTriangle size={14} />
          Admin works best on desktop
        </div>
      )}

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-[#1A1A1A] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-white/5",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
            <Link to="/admin" className="text-xl font-bold tracking-tight text-[#D4AF37]">
              V GRAND <span className="text-xs text-white/40">ADMIN</span>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group",
                  location.pathname === item.path 
                    ? "bg-[#D4AF37] text-black" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={20} className={cn(
                  location.pathname === item.path ? "text-black" : "text-white/40 group-hover:text-white"
                )} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-3 py-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-[10px] text-white/40 uppercase">Administrator</p>
              </div>
            </div>
            <button 
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-white/60 hover:bg-red-500/10 hover:text-red-500 transition-colors duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="flex h-20 items-center justify-between px-4 lg:px-8 border-b border-white/5 bg-[#0F0F0F]/80 backdrop-blur-md sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs text-white/40 hover:text-[#D4AF37] transition-colors">
              View Site
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
