"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { User } from "@/lib/types";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from "@/lib/api";

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

  useEffect(() => {
    function loadUserFromLocalStorage() {
      try {
        const token = localStorage.getItem("jwt_token");
        const userId = localStorage.getItem("user_id");
        const userRole = localStorage.getItem("user_role");

        if (token && userId && userRole) {
          setUser({
            id: userId,
            name: "User",
            email: "",
            role: userRole as "CUSTOMER" | "ADMIN",
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load user from localStorage:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUserFromLocalStorage();
  }, []);

  // Redirect based on auth status and current route
  useEffect(() => {
    if (loading) return;

    // Protected admin routes
    if (pathname?.startsWith("/admin") && (!user || user.role !== "ADMIN")) {
      router.push("/auth/login");
    }

    // Protected customer routes
    if (pathname?.startsWith("/dashboard") && !user) {
      router.push("/auth/login");
    }

    // Redirect logged in users away from auth pages
    if (user && pathname?.startsWith("/auth")) {
      router.push(user.role === "ADMIN" ? "/admin" : "/dashboard");
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password);

      setUser({
        id: response.userId,
        name: "User", // The API doesn't return the name, so this is a placeholder
        email: email,
        role: response.userRole,
      });

      router.push(response.userRole === "ADMIN" ? "/admin" : "/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await apiRegister({ name, email, password });
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();

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
