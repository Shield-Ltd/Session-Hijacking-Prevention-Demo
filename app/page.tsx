import Link from "next/link";
import GlassSurface from "@/components/ui/GlassSurface";
import Squares from "@/components/ui/Squares";

export default function Home() {
  return (
    <div className="min-h-screen w-full h-full bg-black text-white">
      <div className="absolute inset-0 z-0">
        <Squares />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="px-4 md:px-6 h-14 flex items-center">
          <Link href="#" className="flex items-center justify-center" prefetch={false}>
            <span className="text-lg font-medium">Session Hijacking</span>
          </Link>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white">
            Secure Your Sessions
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            This project demonstrates how session hijacking can be performed and how to protect against it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login">
              <GlassSurface
                borderRadius={10}
                className="px-6 py-3 text-lg"
              >
                Login
              </GlassSurface>
            </Link>
            <Link href="/signup">
              <GlassSurface
                borderRadius={10}
                className="px-6 py-3 text-lg"
              >
                Signup
              </GlassSurface>
            </Link>
          </div>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-t-gray-800">
          <p className="text-xs text-gray-500">
            © 2026 Session Hijacking. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-xs hover:underline underline-offset-4" > 
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-xs hover:underline underline-offset-4" prefetch={false}>
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}