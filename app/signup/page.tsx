"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { Loader2, ArrowRight, Mail, User, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GlassSurface from "@/components/ui/GlassSurface"
import Squares from "@/components/ui/Squares"

import { ErrorAlert } from "@/components/ErrorAlert";

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsAlertOpen(true)
      setIsLoading(false)
      return
    }

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsAlertOpen(true)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        setError("Server error: Please check your database connection and environment variables")
        setIsAlertOpen(true)
        setIsLoading(false)
        return
      }

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Signup failed")
        setIsAlertOpen(true)
        setIsLoading(false)
        return
      }

      router.push("/login")
    } catch (error) {
      console.error("Error during signup:", error)
      setError("An unexpected error occurred")
      setIsAlertOpen(true)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full h-full bg-black text-white">
      <div className="absolute inset-0 z-0">
        <Squares />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="px-4 md:px-6 h-14 flex items-center">
          <Link href="/" className="flex items-center justify-center" prefetch={false}>
            <span className="text-lg font-medium">Session Hijacking</span>
          </Link>
        </header>
        
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
              <p className="text-gray-400">Enter your information to get started</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium text-white">Full Name</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="pl-11 pr-4 py-6 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium text-white">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="pl-11 pr-4 py-6 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium text-white">Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    placeholder="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="pl-11 pr-4 py-6 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-white">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="pl-11 pr-4 py-6 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <GlassSurface
                  as="button"
                  type="submit"
                  className="w-full text-white flex items-center justify-center gap-2"
                  disabled={isLoading}
                  borderRadius={10}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </GlassSurface>
              </div>
              
              <div className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-white hover:text-gray-300 transition-colors font-medium">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
        <ErrorAlert
          error={error}
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
        />
      </div>
    </div>
  )
}