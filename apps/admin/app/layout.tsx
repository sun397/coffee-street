import { AuthInitializer } from "@/components/auth-initializer";
import QueryProvider from "@/components/providers/query-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <QueryProvider>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </QueryProvider>
      </body>
    </html>
  );
}
