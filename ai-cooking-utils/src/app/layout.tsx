import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import { SiteHeader } from "@/components/layout/site-header"; // Your header component
import "./globals.css"; // Global styles

// Root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
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
      </body>
    </html>
  );
}
