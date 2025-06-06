"use client";

import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "@/supabase/client";

interface AuthContextProps {
  user: User | null;
  provider: string | null;
  avatar: string | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  provider: null,
  avatar: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // check for active session on paint
    async function getActiveSession() {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    }
    getActiveSession();

    // if session changes, update user
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const provider = user?.app_metadata.provider ?? null;
  const avatar = user?.user_metadata.avatar_url ?? null;

  // provide user, session, loading state and signOut function to whole app
  const value: AuthContextProps = {
    user,
    provider,
    avatar,
    session,
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
