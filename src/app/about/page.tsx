import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-[var(--border)] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-[var(--ink)]">
            SaaS Cost Optimizer
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="text-sm text-[var(--muted)] transition hover:text-[var(--accent)]">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm text-[var(--muted)] transition hover:text-[var(--accent)]">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="card p-8 md:p-12">
          <div className="mb-8">
            <Link
              href="/"
              className="text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
            >
              ← Back to home
            </Link>
          </div>

          <h1 className="mb-6 text-4xl font-semibold text-[var(--ink)] md:text-5xl">
            About SaaS Cost Optimizer
          </h1>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-[var(--ink)]">
                Why we built this
              </h2>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                Companies waste thousands monthly on forgotten subscriptions,
                duplicate tools, and unused seats. Finance teams struggle to get
                visibility into SaaS spend across departments.
              </p>
              <p className="mt-4 text-base text-[var(--muted)] leading-relaxed">
                SaaS Cost Optimizer was built to solve this problem in 5
                minutes, not 5 months. No integrations, no enterprise contracts,
                no training required.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-[var(--ink)]">
                How it works
              </h2>
              <ul className="space-y-3 text-base text-[var(--muted)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white">
                    1
                  </span>
                  <span>
                    <strong className="text-[var(--ink)]">Add your subscriptions</strong> —
                    Enter tool names, costs, billing cycles, and owners
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white">
                    2
                  </span>
                  <span>
                    <strong className="text-[var(--ink)]">See the waste</strong> —
                    We flag unused tools and duplicates automatically
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white">
                    3
                  </span>
                  <span>
                    <strong className="text-[var(--ink)]">Model savings</strong> —
                    Use the calculator to plan your optimization strategy
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white">
                    4
                  </span>
                  <span>
                    <strong className="text-[var(--ink)]">Export & share</strong> —
                    Download CSV reports for finance teams and leadership
                  </span>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-[var(--ink)]">
                Privacy & security
              </h2>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                <strong className="text-[var(--ink)]">All data stays in your browser.</strong> We
                don't have servers, accounts, or cloud storage. Your subscription
                data never leaves your device. This is a local application that
                runs entirely in your browser using localStorage.
              </p>
              <p className="mt-4 text-base text-[var(--muted)] leading-relaxed">
                Clear your browser data, and your subscriptions are gone. We
                can't see them, can't access them, and don't want to.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-[var(--ink)]">
                Tech stack
              </h2>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                Built with modern web technologies for speed and simplicity:
              </p>
              <ul className="mt-4 space-y-2 text-base text-[var(--muted)]">
                <li>• Next.js 15 (React framework)</li>
                <li>• Tailwind CSS (custom design system)</li>
                <li>• TypeScript (type safety)</li>
                <li>• Browser localStorage (data persistence)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-[var(--ink)]">
                Get started
              </h2>
              <p className="mb-6 text-base text-[var(--muted)] leading-relaxed">
                Ready to optimize your SaaS spend? It takes less than 5 minutes
                to see where your money is going.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-8 py-4 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Launch dashboard
              </Link>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
