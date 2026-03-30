export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
