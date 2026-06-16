"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signOutUser } from "@/services/auth.service";

type AuthContextData = { 
  user: User | null; 
  loading: boolean; 
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextData>({ 
  user: null, 
  loading: true,
  logout: async () => {} 
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => { 
      setUser(firebaseUser); 
      setLoading(false); 
    });
    
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Erro ao sair da conta:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}