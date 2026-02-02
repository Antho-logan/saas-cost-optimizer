"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]"></span>
              SaaS Cost Optimizer
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold text-[var(--ink)] md:text-6xl lg:text-7xl">
              Keep every subscription
              <span className="block text-[var(--accent)]"> accountable.</span>
            </h1>

            <p className="max-w-2xl text-base text-[var(--muted)] md:text-lg">
              Track recurring tools, surface hidden waste, and model savings in
              real time. Built for finance and ops teams that need clarity fast.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-8 py-4 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Start optimizing free
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white px-8 py-4 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--accent)]"
              >
                See how it works
              </Link>
            </div>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:gap-12">
              <div className="text-center">
                <p className="text-3xl font-semibold text-[var(--ink)]">23%</p>
                <p className="text-sm text-[var(--muted)]">Average savings</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-semibold text-[var(--ink)]">
                  &lt;5 min
                </p>
                <p className="text-sm text-[var(--muted)]">Setup time</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-semibold text-[var(--ink)]">100%</p>
                <p className="text-sm text-[var(--muted)]">Self-serve</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Features
            </p>
            <h2 className="text-3xl font-semibold text-[var(--ink)] md:text-4xl">
              Everything you need to
              <span className="text-[var(--accent)]"> control spend</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="card flex flex-col gap-4 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-white">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--ink)]">
                Real-time tracking
              </h3>
              <p className="text-sm text-[var(--muted)]">
                See every subscription, billing cycle, and cost in one place.
                Updated instantly as you add or remove tools.
              </p>
            </div>

            <div className="card flex flex-col gap-4 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-2)] text-white">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--ink)]">
                Waste detection
              </h3>
              <p className="text-sm text-[var(--muted)]">
                Automatically flags unused subscriptions and duplicate tools.
                See exactly where your money is leaking.
              </p>
            </div>

            <div className="card flex flex-col gap-4 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-3)] text-white">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--ink)]">
                Savings calculator
              </h3>
              <p className="text-sm text-[var(--muted)]">
                Model savings scenarios by cutting waste and negotiating better
                deals. See your path to lower monthly spend.
              </p>
            </div>

            <div className="card flex flex-col gap-4 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-white">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--ink)]">
                One-click export
              </h3>
              <p className="text-sm text-[var(--muted)]">
                Export your data to CSV for finance teams, accounting, or board
                presentations. Ready in seconds.
              </p>
            </div>

            <div className="card flex flex-col gap-4 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-2)] text-white">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--ink)]">
                Private & secure
              </h3>
              <p className="text-sm text-[var(--muted)]">
                All data stays in your browser. No accounts, no cloud storage,
                no tracking. Your financial data is yours.
              </p>
            </div>

            <div className="card flex flex-col gap-4 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-3)] text-white">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--ink)]">
                Setup in 5 minutes
              </h3>
              <p className="text-sm text-[var(--muted)]">
                No integrations needed. Just add your subscriptions and start
                optimizing. Works immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="card overflow-hidden p-8 md:p-12">
            <div className="flex flex-col items-center gap-6 text-center">
              <h2 className="text-3xl font-semibold text-[var(--ink)] md:text-4xl">
                Ready to stop wasting money on
                <span className="text-[var(--accent)]"> unused tools?</span>
              </h2>
              <p className="text-base text-[var(--muted)] md:text-lg">
                Join finance teams who've cut their SaaS spend by 23% on
                average. Free to start, no credit card required.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-8 py-4 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Start optimizing now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm text-[var(--muted)]">
              © 2026 SaaS Cost Optimizer. Built with care.
            </p>
            <div className="flex gap-6">
              <Link href="/about" className="text-sm text-[var(--muted)] transition hover:text-[var(--accent)]">
                About
              </Link>
              <Link href="/dashboard" className="text-sm text-[var(--muted)] transition hover:text-[var(--accent)]">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
