"use client"

import { useEffect, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Download, Volume2, Share2, Edit, ChevronLeft, ChevronRight } from "lucide-react"
import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

const placeholderImages = [
  "/cute-orange-fox-in-magical-forest-children-book-il.jpg",
  "/glowing-golden-path-in-enchanted-forest-children-b.jpg",
  "/wise-owl-talking-to-fox-in-forest-children-book-il.jpg",
  "/fox-crossing-stream-with-butterflies-children-book.jpg",
  "/magical-crystal-in-forest-clearing-children-book-i.jpg",
  "/children-reading-colorful-illustrated-storybook-to.jpg",
  "/open-storybook-with-colorful-illustrated-pages-sho.jpg",
]

export default function StoryPreviewPage() {
  const params = useParams()
  const storyId = params.id as Id<"stories">
  
  // Use the new getStory query that returns structured data
  const story = useQuery(api.storyQueries.getStory, { storyId })

  const [currentPage, setCurrentPage] = useState(0)

  // Loading state
  if (!story) {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-muted-foreground">Loading story...</p>
          </div>
        </main>
      </div>
    )
  }

  // If story is still generating
  if (story.status === "generating") {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-lg font-semibold">Generating your story...</p>
            <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
          </div>
        </main>
      </div>
    )
  }

  // If story generation failed
  if (story.status === "failed") {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center max-w-md">
            <p className="text-lg font-semibold text-destructive">Story generation failed</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please try generating the story again
            </p>
          </div>
        </main>
      </div>
    )
  }

  // No pages found
  if (!story.pages || story.pages.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center max-w-md">
            <p className="text-lg font-semibold">No pages found</p>
            <p className="text-sm text-muted-foreground mt-2">
              This story doesn't have any pages yet
            </p>
          </div>
        </main>
      </div>
    )
  }

  const currentPageData = story.pages[currentPage]
  
  // Get placeholder image (cycle through available images)
  const pageImage = currentPageData.illustrationUrl || 
    placeholderImages[currentPage % placeholderImages.length]

  const nextPage = () => {
    if (currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleDownload = () => {
    console.log("Download PDF")
    // TODO: Implement PDF generation
  }

  const handleGenerateAudio = () => {
    console.log("Generate audio")
    // TODO: Implement audio generation
  }

  const handleShare = () => {
    console.log("Share story")
    // TODO: Implement sharing functionality
  }

  const handleEdit = () => {
    console.log("Edit story")
    // TODO: Implement story editing
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div>
            <h1 className="font-display text-xl font-semibold">{story.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <span>Page {currentPage + 1} of {story.pages.length}</span>
              <span>•</span>
              <span>Ages {story.ageGroup.min}-{story.ageGroup.max}</span>
              {story.characters.length > 0 && (
                <>
                  <span>•</span>
                  <span>{story.characters.length} characters</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleGenerateAudio}>
              <Volume2 className="mr-2 h-4 w-4" />
              Generate Audio
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Story Content */}
        <div className="flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-muted/30 via-background to-muted/20 p-8">
          <div className="relative h-full w-full max-w-5xl">
            {/* Single Page with 3D book effect */}
            <div
              className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl"
              style={{
                perspective: "1500px",
              }}
            >
              {/* Page Container */}
              <div
                className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateY(0deg)",
                }}
              >
                {/* Full background image */}
                <div className="absolute inset-0">
                  <img
                    src={pageImage}
                    alt={`Story illustration for page ${currentPage + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {/* Subtle gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 flex h-full flex-col p-8">
                  {/* Page number at top left */}
                  <div className="mb-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 font-display text-sm font-semibold text-primary shadow-lg backdrop-blur-sm">
                      {currentPageData.pageNumber}
                    </span>
                  </div>

                  {/* Text bubble at top */}
                  <div
                    className="max-w-2xl rounded-3xl bg-white/90 px-6 py-4 shadow-xl backdrop-blur-sm"
                    style={{
                      borderRadius: "30px 30px 30px 8px",
                    }}
                  >
                    <p className="font-serif text-sm leading-relaxed text-foreground sm:text-base whitespace-pre-wrap">
                      {currentPageData.text}
                    </p>
                    
                    {/* Interactive question if present */}
                    {currentPageData.interactiveQuestion && (
                      <div className="mt-4 pt-4 border-t border-primary/20">
                        <p className="font-serif text-sm italic text-primary">
                          💭 {currentPageData.interactiveQuestion}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Illustration prompt hint (for debugging/future use) */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-auto">
                      <details className="max-w-2xl rounded-lg bg-black/50 px-4 py-2 text-xs text-white/80 backdrop-blur-sm">
                        <summary className="cursor-pointer">Illustration Prompt</summary>
                        <p className="mt-2 text-white/60">{currentPageData.illustrationPrompt}</p>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-border bg-background px-6 py-4">
          <Button 
            variant="outline" 
            onClick={prevPage} 
            disabled={currentPage === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {story.pages.map((page, index) => (
              <button
                key={page._id}
                onClick={() => setCurrentPage(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentPage 
                    ? "w-8 bg-primary" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to page ${page.pageNumber}`}
              />
            ))}
          </div>

          <Button 
            variant="outline" 
            onClick={nextPage} 
            disabled={currentPage === story.pages.length - 1}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}