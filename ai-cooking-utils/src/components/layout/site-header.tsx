// src/components/layout/site-header.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/meal-plan", label: "Meal plan" },
  { href: "/recipes", label: "Recipes" },
  { href: "/account", label: "My account" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold">
            🍽️
          </div>
          <span className="text-lg font-semibold tracking-tight">cookAID</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <span className="hidden text-sm sm:inline">{session.user?.name}</span>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session.user?.image || ""}
                  alt="User avatar"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden sm:inline-flex"
              >
                Log out
              </Button>
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm">
              <Link href="/api/auth/signin">Log in</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {session && mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-2">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-2 w-full justify-center"
            >
              Log out
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
