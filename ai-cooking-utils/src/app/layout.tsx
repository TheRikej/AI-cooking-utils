import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import { SiteHeader } from "@/components/layout/site-header"; // Your header component
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css"; // Global styles

import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | CookAid",
    default: "CookAid - Your Recipe Companion",
  },
  description:
    "CookAid helps you find, create, and share delicious recipes with ease.",
  keywords: "recipes, cooking, food, kitchen, AI, meal planning, cookbook",
  openGraph: {
    title: "CookAid - Your Recipe Companion",
    description: "CookAid helps you find, create, and share delicious recipes.",
    url: "https://cookaid.vercel.app",
    siteName: "CookAid",
    images: [
      {
        url: "https://cookaid.vercel.app/plate.jpg",
        width: 1200,
        height: 630,
        alt: "CookAid Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@CookAid",
    creator: "@CookAid",
    title: "CookAid - Your Recipe Companion",
    description: "CookAid helps you find, create, and share delicious recipes.",
    images: ["https://cookaid.vercel.app/plate.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <QueryProvider>
          <SessionProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />

              <main className="mx-auto flex w-full max-w-5xl flex-1 px-4 pb-10 pt-6">
                {children} {/* This will render the page content */}
              </main>

              <footer className="border-t bg-background/80">
                <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 text-xs text-muted-foreground">
                  <span>© {new Date().getFullYear()} cookAID</span>
                  <span>Meal planning · AI recipes · Personal cookbook</span>
                </div>
              </footer>
            </div>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
