"use client";

import type React from "react";

import { Logo } from "@/components/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import SignInButton from "@/components/SignInButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  handleSignIn,
  handleSignInWithGoogle,
} from "@/lib/actions/signinActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// Move schema outside component to prevent recreating on each render
const formSchema = z.object({
  identifier: z.string().min(2, "Enter your email or username"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // WORK IN PROGRESS SHYIRAHO UBURYO UWO TWOHEREJE LINK USERNAME NA PASSWORD BYI POPLING
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  console.log({ session, status });

  useEffect(() => {
    console.log('RUNNN');
    
    if (status === "authenticated" && session?.user) {
      router.push("/dashboard");
    }
  }, [status, session]);

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);
      setError(null);

      // Pass identifier (email or username) to the sign-in handler
      const response = await handleSignIn(values.identifier, values.password);

      if (response.success) {
        // Success case - form will be reset and redirection handled by useEffect
        form.reset();
        // You can customize the redirect target as needed
        return;
      }

      // Error case
      setError(response.error || "Failed to sign in");
      form.reset({ identifier: values.identifier, password: "" }); // Keep identifier, clear password
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login:", { email, password });
  };

  if (redirecting) {
    return (
      <section className="flex items-center justify-center w-full h-screen">
        <span className="flex items-center gap-2 justify-center">
          <Loader2 className="animate-spin h-5 w-5" />
          Login successful! Redirecting...
        </span>
      </section>
    );
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-background p-4">
      <div className="mb-8">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="font-display text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your StoryWeaver AI account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full bg-transparent cursor-pointer"
            size="lg"
            onClick={() => {
              handleSignInWithGoogle();
            }}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginPage />
    </Suspense>
  );
}

<SignInButton />;

// export default function LoginPage() {
//

//   const handleGoogleLogin = () => {
//     // Handle Google login logic here
//     console.log("Google login")
//   }

//
