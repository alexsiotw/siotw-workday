"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  })

  // Utility to wait
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      // 1. Sign In
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password.trim(),
      })

      if (authError) throw authError

      // 2. Fetch User Role with Retry Logic (Handles database propagation delay)
      let userData = null;
      let userError = null;
      const maxRetries = 3;
      
      for (let i = 0; i < maxRetries; i++) {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', authData.user!.id)
          .maybeSingle()

        if (data) {
          userData = data;
          break;
        }
        
        if (error) {
          userError = error;
          break;
        }

        // If no data and no error, it's missing. Wait and retry.
        if (i < maxRetries - 1) {
          console.log(`Profile missing, retrying... (${i + 1}/${maxRetries})`);
          await sleep(1000); // Wait 1 second before retry
        }
      }

      if (userError) throw userError

      if (!userData) {
        throw new Error("Your account exists, but your student profile is still being synchronized. Please wait 10 seconds and try again.")
      }

      toast.success("Welcome back!")

      // 3. Redirect based on role
      if (userData.role === 'admin') {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
      
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-[#005cb9]" />
        <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
          <GraduationCap className="h-6 w-6" />
          SIOTW Workday
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg text-blue-50">
              &ldquo;This system has revolutionized how we handle course registration. Clean, efficient, and reliable.&rdquo;
            </p>
            <footer className="text-sm opacity-80">Workday University</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card className="border-none shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign in</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      autoCapitalize="none"
                      autoComplete="current-password"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-[#005cb9] hover:bg-[#004a96]" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground text-center">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-[#005cb9] underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
