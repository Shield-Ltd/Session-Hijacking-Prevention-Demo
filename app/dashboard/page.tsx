"use client"
import {Button} from "@/components/ui/button";
export default function Dashboard(){
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