import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

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
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}