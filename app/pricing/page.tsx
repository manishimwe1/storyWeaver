import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out StoryWeaver AI",
      features: [
        "5 stories per month",
        "Basic illustrations",
        "Standard story length",
        "PDF export",
        "Community support",
      ],
      cta: "Get Started",
      href: "/create",
      popular: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For parents and individual educators",
      features: [
        "Unlimited stories",
        "Premium illustrations",
        "Custom story length",
        "PDF & audio export",
        "Priority support",
        "Advanced editing tools",
        "Commercial use rights",
      ],
      cta: "Start Free Trial",
      href: "/create",
      popular: true,
    },
    {
      name: "Classroom",
      price: "$49",
      period: "per month",
      description: "Designed for schools and organizations",
      features: [
        "Everything in Pro",
        "30 student accounts",
        "Classroom management",
        "Bulk story creation",
        "Analytics dashboard",
        "Dedicated support",
        "Custom branding",
        "API access",
      ],
      cta: "Contact Sales",
      href: "/contact",
      popular: false,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-accent/5 to-background py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Choose the perfect plan for your storytelling needs. All plans include our core AI features.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative flex flex-col ${
                    plan.popular ? "border-2 border-primary shadow-xl scale-105" : "border-2"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <CardHeader className="pb-8 pt-8">
                    <CardTitle className="font-display text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="font-display text-5xl font-bold">{plan.price}</span>
                      <span className="ml-2 text-muted-foreground">/ {plan.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-8">
                    <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"} size="lg">
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-12 text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Can I change plans later?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and
                      we'll prorate any charges.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">What payment methods do you accept?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      We accept all major credit cards, PayPal, and can arrange invoicing for Classroom plans.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Is there a free trial?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Yes! Pro and Classroom plans come with a 14-day free trial. No credit card required to start.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Can I use stories commercially?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Pro and Classroom plans include commercial use rights. Free plan stories are for personal use
                      only.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">What if I need more than 30 student accounts?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      We offer custom Enterprise plans for larger schools and districts. Contact our sales team for a
                      personalized quote.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent p-12 text-center shadow-2xl">
              <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl">
                Still Have Questions?
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/90 leading-relaxed">
                Our team is here to help you find the perfect plan for your needs.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" variant="secondary" className="shadow-lg">
                  <Link href="/contact">Contact Sales</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="/create">Start Free Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
