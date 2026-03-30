import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LogIn, User, Lock, ShieldCheck } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { signInWithUsername } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsLoggingIn(true);
    try {
      const { error } = await signInWithUsername(username, password);
      if (error) {
        toast.error(`Login failed: ${error.message}`);
      } else {
        toast.success('Successfully logged in!');
        navigate('/admin');
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Cinematic Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37] opacity-[0.03] rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600 opacity-[0.02] rounded-full blur-[100px]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-8 lg:p-10 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-black mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">V Grand Admin</h1>
            <p className="text-white/40 text-sm mt-1">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Secret Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all font-medium"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#C49F27] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(212,175,55,0.2)]"
            >
              {isLoggingIn ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
              ) : (
                <>
                  <LogIn size={20} />
                  SECURE LOGIN
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-white/40 text-xs hover:text-white transition-colors"
            >
              Return to Public Site
            </button>
          </div>
        </div>
        
        <p className="text-center mt-6 text-[10px] text-white/20 uppercase tracking-[0.2em]">
          V Grand Restaurant System Management • v1.0.0
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
