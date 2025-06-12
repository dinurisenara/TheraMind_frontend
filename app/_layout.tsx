// app/_layout.tsx
import { Slot, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { useEffect } from 'react';

function Guarded() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If no token, send user to /login
    if (!token) router.replace('/login');
  }, [token]);

  return <Slot />; 
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Guarded />
    </AuthProvider>
  );
}
