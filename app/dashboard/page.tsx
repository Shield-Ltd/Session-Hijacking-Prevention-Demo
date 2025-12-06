"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {Button} from "@/components/ui/button";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const fpPromise = FingerprintJS.load();

export default function Dashboard(){
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{id: string; email: string} | null>(null);
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
            credentials: 'include', // Important: sends cookies
        });

        const data = await response.json();

        if (!response.ok || !data.valid) {
            if (data.hijacked) {
                alert('⚠️ Security Alert: Session hijacking detected! You have been logged out for security reasons.');
                document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                router.push('/login');
                return;
            }
            
            // Other authentication errors
            router.push('/login');
            return;
        }

        // Session is valid
        setUser(data.user);
        
        } catch (error) {
            console.error('Session verification error:', error);
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
    return(
        <div>
            <p>
                BLAHHHHHH
            </p>
            <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-4"
                onClick={handleLogout}
            >
                Logout
            </Button>
        </div>
    )
}