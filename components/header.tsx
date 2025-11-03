"use client"

import Link from "next/link"
import { Logo } from "./logo"
import { Button } from "./ui/button"
import { useSession } from "next-auth/react"
import UserButton from "./userButton"

export function Header() {
  const session = useSession()
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Login
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session.status === "authenticated" ? (
            <UserButton />
          ) : (
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/create">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
