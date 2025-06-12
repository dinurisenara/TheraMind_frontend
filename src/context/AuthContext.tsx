// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi, logoutApi, fetchProfile, registerApi } from '../services/api';
import type { User, AuthContextType } from '../types/models';

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore token & user on startup
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('userToken');
        if (stored) {
          setToken(stored);
          const profile = await fetchProfile(stored);
          setUser(profile);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { token: access_token , user: user} = await loginApi(email, password);
    console.log('signIn user', user);
    console.log('signIn access_token', access_token);

    await AsyncStorage.setItem('userToken', access_token);
    setToken(access_token);
    setUser(user);
  };

   // signUp registers a new user, then auto-signs in
  const signUp = async (email: string, password: string) => {
    // call your backend’s register endpoint
     await registerApi(email, password);
    const { token: access_token ,user } = await loginApi(email, password);
    const current_user = await fetchProfile(access_token);
    console.log('current_user', current_user);
    // persist & set state exactly like signIn
    await AsyncStorage.setItem('userToken', access_token);
    setToken(access_token);
    setUser(user);
  };

  const signOut = async () => {
    if (token) await logoutApi(token);
    await AsyncStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
  };

  if (loading) return null; // or a splash

  return (
    
    <AuthContext.Provider value={{ user, token, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);
