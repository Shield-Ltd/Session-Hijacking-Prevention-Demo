import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";   
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SHIELD Demo",
  description: "Secure session hijacking protection system",
  icons: {
    icon: [
      {
        url: "/favicon-dark.ico",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-light.ico",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}

        {/* ✅ SONNER TOASTER */}
        <Toaster
          richColors
          position="top-right"
          closeButton
        />
      </body>
    </html>
  );
}
