/**
 * Enterprise Authentication Context for RoadSense AI.
 * Manages JWT session state, user profile, and auth actions across the app.
 * Inspired by Instagram/Twitter/X auth patterns: instant UI updates,
 * optimistic login states, and graceful session recovery.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface User {
  user_id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'citizen' | 'enforcement_officer' | 'system_admin' | 'fleet_operator' | 'ev_operator';
  jurisdiction?: string;
  badge_number?: string;
  vehicle_plate?: string;
  badge_color?: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = '/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const restoreSession = useCallback(async () => {
    const storedToken = localStorage.getItem('roadsense_token');
    const storedUser = localStorage.getItem('roadsense_user');

    if (!storedToken || !storedUser) {
      setIsLoading(false);
      return;
    }

    try {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      // Validate token with backend
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (res.ok) {
        const profile = await res.json();
        setUser(profile);
      } else {
        // Token expired or invalid — clear session
        localStorage.removeItem('roadsense_token');
        localStorage.removeItem('roadsense_user');
        setToken(null);
        setUser(null);
      }
    } catch {
      // Network error — keep local session but mark as unverified
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'Login failed' }));
        throw new Error(errData.detail || 'Invalid email or password');
      }

      const data = await res.json();

      localStorage.setItem('roadsense_token', data.access_token);
      localStorage.setItem('roadsense_user', JSON.stringify(data.user));

      setToken(data.access_token);
      setUser(data.user);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch {
      // Ignore logout API errors — always clear local session
    } finally {
      localStorage.removeItem('roadsense_token');
      localStorage.removeItem('roadsense_user');
      setToken(null);
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, isLoading, error, login, logout, clearError, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}