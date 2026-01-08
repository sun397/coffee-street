import { AuthProvider } from "@/context/auth-context";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen antialiased bg-[#FAF9F6] text-[#3E2723]`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
