"use client";

import Link from "next/link";
import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Edit,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function MyStoriesPage() {
  const stories = useQuery(api.story.getStories);

  const [searchQuery, setSearchQuery] = useState("");
  if (!stories) {
    return null;
  }
  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-2 font-display text-3xl font-bold tracking-tight">
                My Stories
              </h1>
              <p className="text-muted-foreground">
                {stories.length} {stories.length === 1 ? "story" : "stories"} in
                your collection
              </p>
            </div>
            <Button asChild>
              <Link href="/create">Create New Story</Link>
            </Button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Stories Grid */}
          {filteredStories.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredStories.map((story) => (
                <Card
                  key={story._id}
                  className="group overflow-hidden border-2 transition-all hover:shadow-lg"
                >
                  <div className="relative">
                    <Link href={`/story/preview/${story._id}`}>
                      <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                        <img
                          src={"/placeholder.svg"}
                          alt={story.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="absolute right-2 top-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <Link href="/story/preview">
                      <h3 className="mb-1 font-display font-semibold hover:text-primary">
                        {story.title}
                      </h3>
                    </Link>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Created {"Manzi kyle"}
                    </p>
                    <div className="flex items-center gap-2">
                      {story.storyAge.map((age) => (
                        <span
                          key={age}
                          className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                        >
                          {age}
                        </span>
                      ))}
                      <span className="text-xs text-muted-foreground">
                        {1} pages
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">
                  No stories found
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Try adjusting your search query
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
