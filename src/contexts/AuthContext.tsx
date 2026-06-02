"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";

type AuthContextData = { user: User | null; loading: boolean; };
export const AuthContext = createContext<AuthContextData>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => { setUser(firebaseUser); setLoading(false); });
    return () => unsubscribe();
  }, []);
  const value = useMemo(() => ({ user, loading }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
