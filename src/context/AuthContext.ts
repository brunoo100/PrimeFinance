import { createContext } from "react";
import type { User } from "@supabase/supabase-js";

export type AuthContextData = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextData | null>(null);
