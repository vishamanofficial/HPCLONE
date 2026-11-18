import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../services/api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  avatar?: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('hp_admin_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('hp_admin_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
          setToken(storedToken);
        } else {
          localStorage.removeItem('hp_admin_token');
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        localStorage.removeItem('hp_admin_token');
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('hp_admin_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return true;
      }
      return false;
    } catch (err: any) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('hp_admin_token');
    setToken(null);
    setUser(null);
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    if (user.role === 'Super Admin') return true;
    return roles.includes(user.role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'Super Admin') return true;
    if (user.permissions?.includes('*')) return true;
    return user.permissions?.includes(permission) || false;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        hasRole,
        hasPermission
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
