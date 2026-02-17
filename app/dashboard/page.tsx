"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import Squares from "@/components/ui/Squares";
import { LoadingScreen } from "./_components/LoadingScreen";
import { DashboardHeader } from "./_components/DashboardHeader";
import { DashboardContent } from "./_components/DashboardContent";
import {toast} from "sonner";

const fpPromise = FingerprintJS.load();

type UserState = {
  email: string;
  name?: string;
} | null;

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserState>(null);
  const router = useRouter();

  useEffect(() => {
    verifySession();
  }, []);

  const verifySession = async () => {
    try {
      setLoading(true);

      const fp = await fpPromise;
      const result = await fp.get();
      const visitorId = result.visitorId;

      const response = await fetch("/api/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint: visitorId }),
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        router.push("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.valid) {
        if (data.hijacked) {
          toast.error(
            "Security Alert: Session hijacking detected! You have been logged out.",
            {
              duration: 5000,
            }
          );
          document.cookie =
            "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }

        router.push("/login");
        setTimeout(() => (window.location.href = "/login"), 5000);
        return;
      }

      try {
        const userResp = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
        });

        if (!userResp.ok) {
          router.push("/login");
          return;
        }

        const userData = await userResp.json();
        setUser({ email: userData.user.email, name: userData.user.name });
      } catch {
        router.push("/login");
        return;
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Session verification error:", error);
      setLoading(false);
      router.push("/login");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen w-full h-full bg-black text-white">
      <div className="absolute inset-0 z-0">
        <Squares />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <DashboardHeader user={user} />
        <DashboardContent />
      </div>
    </div>
  );
}
