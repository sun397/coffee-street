// apps/admin/app/layout.tsx
import { Providers } from "@/lib/providers";
import { AuthInitializer } from "@/components/auth-initializer";
import { AuthGuard } from "@/components/auth-guard";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <AuthInitializer>
            <AuthGuard>
              {children}
            </AuthGuard>
          </AuthInitializer>
        </Providers>
      </body>
    </html>
  );
}
