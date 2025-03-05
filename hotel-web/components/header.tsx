"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/authProvider";
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
      <div className="container flex items-center h-16">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <BedDouble className="w-6 h-6" />
          <span>HotelWeb</span>
        </Link>

        <nav className="hidden gap-6 ml-10 md:flex">
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
          {user?.role === "ADMIN" && (
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

        <div className="flex items-center gap-2 ml-auto">
          {user ? (
            <div className="items-center hidden gap-4 md:flex">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="items-center hidden gap-2 md:flex">
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
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container grid gap-4 py-4">
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
            {user?.role === "ADMIN" && (
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
                  <User className="w-4 h-4" />
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
