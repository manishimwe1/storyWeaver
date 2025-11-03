import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Sparkles, Download, User } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Powered by Advanced AI</span>
            </div>

            <h1 className="mb-6 font-display text-4xl font-bold leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl">
              Turn Your Ideas into Magical Storybooks
            </h1>

            <p className="mb-8 text-lg text-muted-foreground leading-relaxed text-balance md:text-xl">
              Type your idea and watch AI bring it to life — with beautiful illustrations and child-friendly
              storytelling.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/create">Create Your Story</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 p-8 shadow-2xl">
              <img
                src="/open-storybook-with-colorful-illustrated-pages-sho.jpg"
                alt="StoryWeaver AI storybook preview"
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="features" className="border-t border-border bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-display text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Create beautiful storybooks in three simple steps
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-2 transition-all hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <span className="font-display text-2xl font-bold">1</span>
                  </div>
                  <h3 className="mb-3 font-display text-xl font-semibold">Describe Your Story Idea</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Share your story concept, characters, and setting. Our AI understands your vision and brings it to
                    life.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 transition-all hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <span className="font-display text-2xl font-bold">2</span>
                  </div>
                  <h3 className="mb-3 font-display text-xl font-semibold">AI Writes & Illustrates</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Watch as AI crafts engaging narratives and creates beautiful, custom illustrations for each page.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 transition-all hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <span className="font-display text-2xl font-bold">3</span>
                  </div>
                  <h3 className="mb-3 font-display text-xl font-semibold">Read or Export Your Story</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Enjoy your storybook online, download as PDF, or generate audio narration for bedtime stories.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center">
                <h2 className="mb-6 font-display text-3xl font-bold tracking-tight md:text-4xl">
                  Perfect for Teachers & Parents
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-display font-semibold">Educational Content</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Create stories that teach valuable lessons, morals, and educational concepts in an engaging way.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-display font-semibold">Personalized Stories</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Make your child the hero of their own adventure with customized characters and settings.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-display font-semibold">Export & Share</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Download your stories as PDFs or share them digitally with students, family, and friends.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent/10 to-primary/10 p-8 shadow-xl">
                  <img
                    src="/children-reading-colorful-illustrated-storybook-to.jpg"
                    alt="Children enjoying storybooks"
                    className="w-full rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Loved by Teachers & Parents
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                See what educators and families are saying about StoryWeaver AI
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-semibold">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Elementary Teacher</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "StoryWeaver AI has transformed my classroom! My students are more engaged than ever, and I can
                    create personalized stories for each lesson."
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-semibold">Michael Chen</p>
                      <p className="text-sm text-muted-foreground">Parent of Two</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "My kids love being the heroes in their own stories! Bedtime has never been more magical. The
                    illustrations are absolutely beautiful."
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-semibold">Emily Rodriguez</p>
                      <p className="text-sm text-muted-foreground">Librarian</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "This tool is incredible for creating diverse, inclusive stories that represent all our students.
                    Highly recommend for any educator!"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent p-12 text-center shadow-2xl">
              <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl">
                Ready to Create Magic?
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/90 leading-relaxed">
                Start crafting beautiful, personalized storybooks today. No credit card required.
              </p>
              <Button asChild size="lg" variant="secondary" className="shadow-lg">
                <Link href="/create">Create Your First Story</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
