"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"

export default function CreateStoryPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [title, setTitle] = useState("")
  const [ageGroup, setAgeGroup] = useState("")
  const [storyIdea, setStoryIdea] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
      router.push("/story/preview")
    }, 3000)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8">
            <h1 className="mb-2 font-display text-3xl font-bold tracking-tight">Create a New Story</h1>
            <p className="text-muted-foreground">
              Share your story idea and let AI bring it to life with beautiful illustrations
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Story Details
              </CardTitle>
              <CardDescription>Tell us about the story you want to create</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Story Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., The Magical Forest Adventure"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isGenerating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age-group">Target Age Group</Label>
                  <Select value={ageGroup} onValueChange={setAgeGroup} disabled={isGenerating}>
                    <SelectTrigger id="age-group">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-5">3-5 years (Preschool)</SelectItem>
                      <SelectItem value="6-8">6-8 years (Early Elementary)</SelectItem>
                      <SelectItem value="9-12">9-12 years (Middle Elementary)</SelectItem>
                      <SelectItem value="13+">13+ years (Young Adult)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="story-idea">Story Idea / Description</Label>
                  <Textarea
                    id="story-idea"
                    placeholder="Describe your story idea... Include characters, setting, and what happens in the story. The more details you provide, the better the AI can bring your vision to life!"
                    value={storyIdea}
                    onChange={(e) => setStoryIdea(e.target.value)}
                    required
                    disabled={isGenerating}
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">{storyIdea.length} / 1000 characters</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <h3 className="mb-2 font-display text-sm font-semibold">Tips for great stories:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Include specific character names and descriptions</li>
                    <li>• Describe the setting and atmosphere</li>
                    <li>• Mention the main conflict or adventure</li>
                    <li>• Add any moral or lesson you want to convey</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isGenerating || !title || !ageGroup || !storyIdea}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Weaving your story magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Story
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {isGenerating && (
            <Card className="mt-6 border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-display font-semibold">Creating your story...</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI is crafting your narrative and generating beautiful illustrations. This may take a minute.
                    </p>
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full animate-pulse bg-primary" style={{ width: "60%" }} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
