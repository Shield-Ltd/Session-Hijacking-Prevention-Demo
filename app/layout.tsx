import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Session Hijacking",
  description: "Secure session hijacking protection system",
  icons: {
    icon: "/favicon.ico",        // or "/favicon.png"
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
