// apps/admin/app/layout.tsx
import { AuthInitializer } from "@/components/auth-initializer";
import { Providers } from "@/lib/providers";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </Providers>
      </body>
    </html>
  );
}
