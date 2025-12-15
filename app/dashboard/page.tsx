"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import GlassSurface from "@/components/ui/GlassSurface";
import Squares from "@/components/ui/Squares";
import { User, LogOut } from "lucide-react";

const fpPromise = FingerprintJS.load();

export default function Dashboard(){
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{email: string; name?: string} | null>(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const router = useRouter();
    useEffect(() => {
        verifySession();
    }, []);

    const verifySession = async () => {
        try {
        setLoading(true);
        
        // Get browser fingerprint
        const fp = await fpPromise;
        const result = await fp.get();
        const visitorId = result.visitorId;

        // Call session verification API
        const response = await fetch('/api/verify-session', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fingerprint: visitorId }),
            credentials: 'include',
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Non-JSON response:", text);
            router.push('/login');
            return;
        }

        const data = await response.json();

        if (!response.ok || !data.valid) {
            if (data.hijacked) {
                // stop loading UI, notify user, clear cookie and redirect to login
                setLoading(false);
                alert('⚠️ Security Alert: Session hijacking detected! You have been logged out for security reasons.');
                document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                router.push('/login');
                // fallback in case client router doesn't navigate
                setTimeout(() => (window.location.href = '/login'), 150);
                return;
            }

            // Other authentication errors: ensure loading is turned off before redirecting
            setLoading(false);
            router.push('/login');
            setTimeout(() => (window.location.href = '/login'), 150);
            return;
        }

                // Session is valid — fetch full user details from /api/user
                try {
                    const userResp = await fetch('/api/user', {
                        method: 'GET',
                        credentials: 'include',
                    })

                    if (!userResp.ok) {
                        console.error('Failed to fetch user details', await userResp.text())
                        router.push('/login')
                        return
                    }

                    const userData = await userResp.json()
                    // Expect { user: { id, name, email } }
                    setUser({ email: userData.user.email, name: userData.user.name })
                } catch (err) {
                    console.error('Error fetching user details:', err)
                    router.push('/login')
                    return
                } finally {
                    setLoading(false)
                }
        
        } catch (error) {
            console.error('Session verification error:', error);
            setLoading(false);
            router.push('/login');
        }
    };

    const handleLogout = async () => {
        try {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "same-origin",
        })

        if (response.ok) {
            window.location.href = "/login"
        }
        } catch (error) {
        console.error("Logout error:", error)
        }
    }
    if (loading) {
        return (
            <div className="min-h-screen w-full h-full bg-black text-white">
                <div className="absolute inset-0 z-0">
                    <Squares />
                </div>
                <div className="relative z-10 flex flex-col min-h-screen items-center justify-center">
                    <GlassSurface
                        borderRadius={20}
                        className="p-8"
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-white">Loading...</span>
                        </div>
                    </GlassSurface>
                </div>
            </div>
        );
    }

    return(
        <div className="min-h-screen w-full h-full bg-black text-white">
            <div className="absolute inset-0 z-0">
                <Squares />
            </div>
            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="px-4 md:px-6 h-14 flex items-center justify-between relative z-50">
                    <Link href="/" className="flex items-center justify-center" prefetch={false}>
                        <span className="text-lg font-medium">Session Hijacking</span>
                    </Link>
                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white font-medium transition-all"
                            >
                                <User className="h-5 w-5" />
                                <span className="hidden sm:inline">{user.name ? user.name : user.email.split('@')[0]}</span>
                            </button>
                            {showProfileMenu && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setShowProfileMenu(false)}
                                    ></div>
                                    <div className="absolute right-0 top-14 z-50 w-64 bg-black/95 backdrop-blur-lg border border-white/30 rounded-xl p-4 shadow-xl">
                                        <div className="space-y-4">
                                            <div className="pb-3 border-b border-white/10">
                                                <p className="text-xs text-gray-400 mb-1">Profile</p>
                                                <p className="text-white font-medium text-sm">{user.email}</p>
                                                {/* ID is not fetched/displayed from DB here */}
                                            </div>
                                            <GlassSurface
                                                as="button"
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    handleLogout();
                                                }}
                                                borderRadius={10}
                                                className="w-full text-white flex items-center justify-center gap-2"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </GlassSurface>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </header>
                <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                    <div className="w-full max-w-2xl space-y-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome to your secure session</h1>
                            <p className="text-gray-400">Enjoyyyyyyyy!!!</p>
                        </div>
                        
                        <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
                            <h2 className="text-xl font-bold text-white mb-3">Session Hijacking Protection</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-green-400"></div>
                                    <div>
                                        <p className="text-white font-medium">Browser Fingerprinting Active</p>
                                        <p className="text-gray-400">Your browser fingerprint is being monitored for security</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-green-400"></div>
                                    <div>
                                        <p className="text-white font-medium">Session Verification</p>
                                        <p className="text-gray-400">Your session is verified on every request</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-green-400"></div>
                                    <div>
                                        <p className="text-white font-medium">Automatic Logout Protection</p>
                                        <p className="text-gray-400">If your session is accessed from a different device, you'll be automatically logged out</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <p className="text-yellow-400 text-xs font-medium">⚠️ Security Notice</p>
                                <p className="text-gray-300 text-xs mt-1">This system uses browser fingerprinting to detect session hijacking attempts. If you access your account from a different browser or device, you'll need to log in again.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}