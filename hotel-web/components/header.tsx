"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { BedDouble, Menu, User, X } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <BedDouble className="h-6 w-6" />
          <span>HotelWeb</span>
        </Link>

        <nav className="hidden md:flex ml-10 gap-6">
          <Link
            href="/rooms"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/rooms") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Rooms
          </Link>
          {user && (
            <Link
              href="/dashboard/bookings"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/dashboard/bookings")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              My Bookings
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname?.startsWith("/admin")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 grid gap-4">
            <Link
              href="/rooms"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/rooms") ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Rooms
            </Link>
            {user && (
              <Link
                href="/dashboard/bookings"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/dashboard/bookings")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Bookings
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname?.startsWith("/admin")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            {user ? (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <div className="flex items-center gap-2 py-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
