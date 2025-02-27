"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is logged in on initial load
  useEffect(() => {
    async function loadUserFromSession() {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Handle non-OK responses
          console.log("Session not found or error:", response.status);
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load user session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUserFromSession();
  }, []);

  // Redirect based on auth status and current route
  useEffect(() => {
    if (loading) return;

    // Protected admin routes
    if (pathname?.startsWith("/admin") && (!user || user.role !== "admin")) {
      router.push("/auth/login");
    }

    // Protected customer routes
    if (pathname?.startsWith("/dashboard") && !user) {
      router.push("/auth/login");
    }

    // Redirect logged in users away from auth pages
    if (user && pathname?.startsWith("/auth")) {
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      setUser(data.user);

      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();
      setUser(data.user);

      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
