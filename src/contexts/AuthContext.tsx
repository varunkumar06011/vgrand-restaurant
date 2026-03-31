import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, isConfigured } from '@/db/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/auth';
import { toast } from 'sonner';

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!isConfigured) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
  return data;
}
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const profileData = await getProfile(user.id);
    setProfile(profileData);
  };

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    supabase
      .auth
      .getSession()
      .then(({ data: { session } }: { data: { session: any } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          getProfile(session.user.id).then(setProfile);
        }
      })
      .catch((error: any) => {
        toast.error(`Failed to get session: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getProfile(session.user.id).then(setProfile);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithUsername = async (username: string, password: string) => {
    // Dev Bypass: ONLY if explicitly enabled via ENV and Supabase is not yet configured
    const isDevBypassEnabled = import.meta.env.VITE_ALLOW_ADMIN_BYPASS === 'true';
    
    if (!isConfigured && isDevBypassEnabled) {
      const isAdminLogin = username === import.meta.env.VITE_DEV_ADMIN_USER && 
                         password === import.meta.env.VITE_DEV_ADMIN_PASS;
      
      if (isAdminLogin) {
        const mockUser = {
          id: 'dev-admin-id',
          email: 'admin@vgrand-dev.local',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User;
        
        const mockProfile: Profile = {
          id: 'dev-admin-id',
          name: 'Dev Administrator',
          email: 'admin@vgrand-dev.local',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setUser(mockUser);
        setProfile(mockProfile);
        return { error: null };
      }
    }

    try {
      const email = username.includes('@') ? username : `${username}@miaoda.com`;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUpWithUsername = async (username: string, password: string) => {
    try {
      const email = username.includes('@') ? username : `${username}@miaoda.com`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (!isConfigured) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithUsername, signUpWithUsername, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
