// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: {
    default: "cookAID – AI meal planner & personal cookbook",
    template: "%s | cookAID",
  },
  description:
    "Plan your meals, generate recipes with AI, and keep a personalized cookbook in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />

          <main className="mx-auto flex w-full max-w-5xl flex-1 px-4 pb-10 pt-6">
            {children}
          </main>

          <footer className="border-t bg-background/80">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 text-xs text-muted-foreground">
              <span>© {new Date().getFullYear()} cookAID</span>
              <span>Meal planning · AI recipes · Personal cookbook</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
