"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Download, Volume2, Share2, Edit, ChevronLeft, ChevronRight } from "lucide-react"

// Sample story data
const storyPages = [
  {
    id: 1,
    text: "Once upon a time, in a magical forest filled with wonder, there lived a curious little fox named Luna. She had the brightest orange fur and the most inquisitive eyes you'd ever seen.",
    image: "/cute-orange-fox-in-magical-forest-children-book-il.jpg",
  },
  {
    id: 2,
    text: "One sunny morning, Luna discovered a mysterious glowing path she had never seen before. The path sparkled with golden light and seemed to whisper her name.",
    image: "/glowing-golden-path-in-enchanted-forest-children-b.jpg",
  },
  {
    id: 3,
    text: "Following the path, Luna met a wise old owl named Oliver. 'The path leads to the Heart of the Forest,' he said, 'where dreams come true for those brave enough to seek them.'",
    image: "/wise-owl-talking-to-fox-in-forest-children-book-il.jpg",
  },
  {
    id: 4,
    text: "With courage in her heart, Luna continued her journey. She crossed babbling brooks, climbed mossy hills, and made friends with butterflies along the way.",
    image: "/fox-crossing-stream-with-butterflies-children-book.jpg",
  },
  {
    id: 5,
    text: "Finally, Luna reached the Heart of the Forest. There, she found a beautiful crystal that showed her the greatest treasure of all: the joy of adventure and the friends she made along the way.",
    image: "/magical-crystal-in-forest-clearing-children-book-i.jpg",
  },
]

export default function StoryPreviewPage() {
  const [currentPage, setCurrentPage] = useState(0)

  const nextPage = () => {
    if (currentPage < storyPages.length - 1) {
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
  }

  const handleGenerateAudio = () => {
    console.log("Generate audio")
  }

  const handleShare = () => {
    console.log("Share story")
  }

  const handleEdit = () => {
    console.log("Edit story")
  }

  const page = storyPages[currentPage]

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div>
            <h1 className="font-display text-xl font-semibold">Luna's Magical Adventure</h1>
            <p className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {storyPages.length}
            </p>
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
                    src={page.image || "/placeholder.svg"}
                    alt={`Story illustration page ${currentPage + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {/* Subtle gradient overlay only at top for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 flex h-full flex-col p-8">
                  {/* Page number at top left */}
                  <div className="mb-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 font-display text-sm font-semibold text-primary shadow-lg backdrop-blur-sm">
                      {currentPage + 1}
                    </span>
                  </div>

                  {/* Text bubble at top - smaller and less intrusive */}
                  <div
                    className="max-w-2xl rounded-3xl bg-white/90 px-6 py-4 shadow-xl backdrop-blur-sm"
                    style={{
                      borderRadius: "30px 30px 30px 8px",
                    }}
                  >
                    <p className="font-serif text-sm leading-relaxed text-foreground sm:text-base">{page.text}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-border bg-background px-6 py-4">
          <Button variant="outline" onClick={prevPage} disabled={currentPage === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {storyPages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentPage ? "w-8 bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          <Button variant="outline" onClick={nextPage} disabled={currentPage === storyPages.length - 1}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
