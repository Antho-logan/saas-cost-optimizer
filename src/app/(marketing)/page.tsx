"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            SaaS Cost Optimizer
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Dashboard
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="pill">
              🎯 For founders & small teams (5–50 people)
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              Never get blindsided<br />
              by a SaaS renewal again
            </h1>
            
            <p className="max-w-2xl text-lg text-[var(--muted)] md:text-xl">
              See what SaaS you're paying for, what's renewing soon, and what you'll spend 
              this year if you do nothing. Clarity in &lt;5 minutes.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[var(--accent)]/90"
              >
                Get Started Free
              </Link>
              <Link
                href="#how-it-works"
                className="ghost-button"
              >
                See How It Works
              </Link>
            </div>

            <p className="text-sm text-[var(--muted)]">
              No account required • Client-side only • Your data never leaves your browser
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="border-t border-[var(--border)] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Sound Familiar?</h2>
            <p className="text-[var(--muted)]">
              Founders and small teams face the same SaaS surprises over and over
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "💳",
                title: "Surprise Renewals",
                description: "You forgot that $1,200 annual renewal for a tool you barely use. It just hit your card."
              },
              {
                icon: "📊",
                title: "No Clarity on Burn",
                description: "Your accountant asks for your SaaS spend. You dig through emails and receipts for hours."
              },
              {
                icon: "🔀",
                title: "Duplicate Tools",
                description: "You have 3 project management tools and 2 analytics platforms. Team members signed up independently."
              }
            ].map((problem, i) => (
              <div key={i} className="card p-8">
                <div className="mb-4 text-4xl">{problem.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{problem.title}</h3>
                <p className="text-[var(--muted)]">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="how-it-works" className="border-t border-[var(--border)] bg-[var(--surface-strong)] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">Three Answers in &lt;5 Minutes</h2>
            <p className="text-[var(--muted)]">
              Add your SaaS tools, get instant clarity
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "What SaaS am I paying for?",
                description: "See all your subscriptions in one place. Monthly cost, annual cost, category, owner.",
                color: "var(--accent)"
              },
              {
                step: "02",
                title: "What's renewing soon?",
                description: "Timeline view shows what's coming up in 30, 60, and 90 days. Flag auto-renewals that catch you off guard.",
                color: "var(--accent-2)"
              },
              {
                step: "03",
                title: "What will I spend this year?",
                description: "'Do nothing' projection: if you change nothing, you'll spend $X on SaaS this year. See it instantly.",
                color: "var(--accent-3)"
              }
            ].map((feature, i) => (
              <div key={i} className="relative">
                <div className="mb-4 text-6xl font-bold opacity-10" style={{ color: feature.color }}>
                  {feature.step}
                </div>
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="text-[var(--muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-[var(--border)] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">What You Get</h2>
            <p className="text-[var(--muted)]">
              Simple, focused features. No bloat.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: "SaaS Timeline",
                description: "Monthly and yearly SaaS burn at a glance. See your total spend and per-tool breakdown.",
                details: ["Monthly burn rate", "Yearly projection", "Per-tool breakdown"]
              },
              {
                title: "Renewal Radar",
                description: "The core wedge: never get ambushed by an annual renewal again.",
                details: ["30/60/90 day renewal view", "Auto-renewal flags", "Renewal cost projections"]
              },
              {
                title: "Smart Signals",
                description: "Hints, not decisions. We flag things you might want to review.",
                details: ["Possible duplicates", "High-cost tools without renewal dates", "Category clustering"]
              },
              {
                title: "Clean Export",
                description: "Download a CSV and send it to your accountant or drop it into a spreadsheet.",
                details: ["One-click CSV export", "Accountant-ready format", "Full data portability"]
              }
            ].map((feature, i) => (
              <div key={i} className="card p-8">
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="mb-4 text-[var(--muted)]">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                      <span className="mt-1 text-[var(--accent)]">✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-[var(--border)] bg-[var(--surface-strong)] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Setup in &lt;5 Minutes</h2>
            <p className="text-[var(--muted)]">
              No demo call. No credit card. No account required.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Quick Setup",
                  description: "Start with common tools (Slack, Notion, Figma, etc.). Check what you have. Add the rest.",
                  time: "30 seconds"
                },
                {
                  step: "2",
                  title: "Add Your Burn",
                  description: "For each tool, enter the monthly or annual cost. Add the renewal date if you know it.",
                  time: "2 minutes"
                },
                {
                  step: "3",
                  title: "Instant Clarity",
                  description: "BAM: You see your SaaS timeline, upcoming renewals, and 12-month projection.",
                  time: "30 seconds"
                },
                {
                  step: "4",
                  title: "Export & Relax",
                  description: "Download the CSV for your accountant. You're done. Set a quarterly reminder to review.",
                  time: "1 minute"
                }
              ].map((step, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-white font-semibold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <span className="pill text-xs">{step.time}</span>
                    </div>
                    <p className="text-[var(--muted)]">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Not For Everyone Section */}
      <section className="border-t border-[var(--border)] px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">This Is NOT For Everyone</h2>
          <p className="mb-12 text-[var(--muted)]">
            We built this for a specific use case. Here's who it's for (and not for).
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="card border-[var(--accent)] p-8 text-left">
              <h3 className="mb-4 text-lg font-semibold text-[var(--accent)]">✅ Built For</h3>
              <ul className="space-y-3 text-[var(--muted)]">
                <li>• Solo founders and small teams (5–50 people)</li>
                <li>• Using 10–40 SaaS tools across the team</li>
                <li>• Want clarity in 5 minutes, not a 3-week implementation</li>
                <li>• Get surprised by annual renewals</li>
                <li>• Value simplicity over enterprise features</li>
              </ul>
            </div>

            <div className="card border-red-200 bg-red-50 p-8 text-left">
              <h3 className="mb-4 text-lg font-semibold text-red-600">❌ Not Built For</h3>
              <ul className="space-y-3 text-[var(--muted)]">
                <li>• Enterprise finance teams</li>
                <li>• Procurement departments</li>
                <li>• Organizations with existing SaaS management platforms</li>
                <li>• Complex approval workflows</li>
                <li>• Usage tracking and analytics (not yet, anyway)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-[var(--border)] bg-[var(--surface-strong)] px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to See Your SaaS Clearly?</h2>
          <p className="mb-8 text-lg text-[var(--muted)]">
            Get clarity on your SaaS spend in &lt;5 minutes. No account required.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[var(--accent)]/90"
          >
            Get Started Free →
          </Link>
          <p className="mt-6 text-sm text-[var(--muted)]">
            Your data never leaves your browser • Client-side only • No account needed
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-12">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-[var(--muted)]">
            Built for founders who value clarity over complexity.
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            No AI over-promises. No fake savings percentages. Just simple, useful visibility.
          </p>
        </div>
      </footer>
    </main>
  );
}
