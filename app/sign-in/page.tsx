"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth/auth-client'
import { Input } from '@/components/ui/input'

export default function SignIn() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message ?? "Failed to sign in. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-gray-200 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-black">
            Sign In</CardTitle>
          <CardDescription className="text-gray-600">
          Enter your credentials to access your job application dashboard and stay organized throughout your job search journey.
          </CardDescription>
        </CardHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
             
                 <div className="space-y-2">
                <Label htmlFor="email" className='text-gray-700'>Email</Label>
                <input type="email" placeholder="John@example.com" id="email" 
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary'
                 value={email} onChange={(e) => setEmail(e.target.value)}required />
              </div>
                <div className="space-y-2">
                <Label htmlFor="password" className='text-gray-700'>Password</Label>
                <input type="password" placeholder="••••••••" id="password" minLength={8}
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary'
                 value={password} onChange={(e) => setPassword(e.target.value)}required />
              </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90"
            disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}</Button>
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "} 
              <Link className='font-medium text-primary hover:underline'
              href="/sign-up">Sign Up</Link>
              </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}