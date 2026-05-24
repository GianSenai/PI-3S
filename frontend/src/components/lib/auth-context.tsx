import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { employees, type Employee } from "./mock-data";

interface AuthContextValue {
  user: Employee | null;
  login: (matricula: string, _password: string) => Employee | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "epi-guardian-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Employee | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const login = (matricula: string, _password: string) => {
    const found = employees.find((e) => e.matricula === matricula.trim());
    if (found) {
      setUser(found);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
      }
      return found;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
