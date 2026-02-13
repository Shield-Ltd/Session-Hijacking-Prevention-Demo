"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import Squares from "@/components/ui/Squares";
import { ErrorAlert } from "@/components/ErrorAlert";
import { LoadingScreen } from "./_components/LoadingScreen";
import { DashboardHeader } from "./_components/DashboardHeader";
import { DashboardContent } from "./_components/DashboardContent";

const fpPromise = FingerprintJS.load();

type UserState = {
  email: string;
  name?: string;
} | null;

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserState>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [isSecurityAlertOpen, setIsSecurityAlertOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    verifySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifySession = async () => {
    try {
      setLoading(true);

      // Get browser fingerprint
      const fp = await fpPromise;
      const result = await fp.get();
      const visitorId = result.visitorId;

      // Call session verification API
      const response = await fetch("/api/verify-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fingerprint: visitorId }),
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        router.push("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.valid) {
        if (data.hijacked) {
          // Terminate session and show a security alert modal
          document.cookie =
            "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          setLoading(false);
          setSecurityError(
            "Security Alert: Session hijacking detected! You have been logged out for security reasons."
          );
          setIsSecurityAlertOpen(true);
          return;
        }

        setLoading(false);
        router.push("/login");
        setTimeout(() => (window.location.href = "/login"), 150);
        return;
      }

      // Session is valid — fetch full user details from /api/user
      try {
        const userResp = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
        });

        if (!userResp.ok) {
          console.error(
            "Failed to fetch user details",
            await userResp.text()
          );
          router.push("/login");
          return;
        }

        const userData = await userResp.json();
        // Expect { user: { id, name, email } }
        setUser({ email: userData.user.email, name: userData.user.name });
      } catch (err) {
        console.error("Error fetching user details:", err);
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

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSecurityAlertClose = () => {
    setIsSecurityAlertOpen(false);
    router.push("/login");
    setTimeout(() => (window.location.href = "/login"), 150);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (securityError) {
    return (
      <div className="min-h-screen w-full h-full bg-black text-white">
        <div className="absolute inset-0 z-0">
          <Squares />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen items-center justify-center">
          <ErrorAlert
            error={securityError}
            isOpen={isSecurityAlertOpen}
            onClose={handleSecurityAlertClose}
            title="Security Alert"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full h-full bg-black text-white">
      <div className="absolute inset-0 z-0">
        <Squares />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <DashboardHeader
          user={user}
          showProfileMenu={showProfileMenu}
          onToggleProfileMenu={() => setShowProfileMenu(!showProfileMenu)}
          onCloseProfileMenu={() => setShowProfileMenu(false)}
          onLogout={handleLogout}
        />
        <DashboardContent />
      </div>
    </div>
  );
}
