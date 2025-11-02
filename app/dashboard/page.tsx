"use client"

import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, BookOpen, Sparkles, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="mb-2 font-display text-3xl font-bold tracking-tight">Welcome back, Sarah!</h1>
            <p className="text-muted-foreground">Ready to create more magical stories today?</p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Stories</p>
                    <p className="mt-2 font-display text-3xl font-bold">12</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">This Month</p>
                    <p className="mt-2 font-display text-3xl font-bold">5</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                    <TrendingUp className="h-6 w-6 text-accent-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Stories Left</p>
                    <p className="mt-2 font-display text-3xl font-bold">Unlimited</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="mb-4 font-display text-xl font-semibold">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="group cursor-pointer border-2 transition-all hover:border-primary hover:shadow-lg">
                <Link href="/create">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                      <PlusCircle className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-display text-lg font-semibold">Create New Story</h3>
                      <p className="text-sm text-muted-foreground">Start a new magical adventure</p>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="group cursor-pointer border-2 transition-all hover:border-primary hover:shadow-lg">
                <Link href="/dashboard/stories">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform group-hover:scale-110">
                      <BookOpen className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-display text-lg font-semibold">View All Stories</h3>
                      <p className="text-sm text-muted-foreground">Browse your story collection</p>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </div>

          {/* Recent Stories Preview */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Recent Stories</h2>
              <Button asChild variant="ghost">
                <Link href="/dashboard/stories">View All</Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="group cursor-pointer overflow-hidden border-2 transition-all hover:shadow-lg">
                  <Link href="/story/preview">
                    <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                      <img
                        src={`/ceholder-svg-key-story.jpg?key=story${i}`}
                        alt="Story thumbnail"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-1 font-display font-semibold">Luna's Magical Adventure</h3>
                      <p className="mb-2 text-sm text-muted-foreground">Created 2 days ago</p>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          6-8 years
                        </span>
                        <span className="text-xs text-muted-foreground">5 pages</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
