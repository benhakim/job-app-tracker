"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { signUp } from '@/lib/auth/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
   const result =   await signUp.email({ name, email, password });
      if (result.error) {
        setError(result.error.message ?? "Failed to sign up. Please try again.");
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
            Sign Up</CardTitle>
          <CardDescription className="text-gray-600">
            Create an account to start tracking your job applications and take control of your job search.
          </CardDescription>
        </CardHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
             {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
              <div className="space-y-2">
                <Label htmlFor="name" className='text-gray-700'>
                  Name</Label>
                <input type="text" placeholder="John Doe" id="name"
                 required className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary'
                 value={name} onChange={(e) => setName(e.target.value)}/>
              </div>
                 <div className="space-y-2">
                <Label htmlFor="email" className='text-gray-700'>Email</Label>
                <input type="email" placeholder="John@example.com" id="email" 
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary' required
                value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
                <div className="space-y-2">
                <Label htmlFor="password" className='text-gray-700'>Password</Label>
                <input type="password" placeholder="••••••••" id="password" minLength={8}
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary' required
                value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90"
            disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}</Button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "} 
              <Link className='font-medium text-primary hover:underline'
              href="/sign-in">Sign In</Link>
              </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}