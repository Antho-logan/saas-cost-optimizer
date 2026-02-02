"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

type Cycle = "monthly" | "quarterly" | "yearly" | "weekly";

type Subscription = {
  id: string;
  name: string;
  cost: number;
  cycle: Cycle;
  used: boolean;
  owner: string;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const cycleLabels: Record<Cycle, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
  weekly: "Weekly"
};

const toMonthly = (cost: number, cycle: Cycle) => {
  switch (cycle) {
    case "yearly":
      return cost / 12;
    case "quarterly":
      return cost / 3;
    case "weekly":
      return cost * 4.33;
    default:
      return cost;
  }
};

const initialSubscriptions: Subscription[] = [
  {
    id: "sub-1",
    name: "Figma",
    cost: 45,
    cycle: "monthly",
    used: true,
    owner: "Design"
  },
  {
    id: "sub-2",
    name: "Notion",
    cost: 120,
    cycle: "yearly",
    used: true,
    owner: "Operations"
  },
  {
    id: "sub-3",
    name: "Notion",
    cost: 18,
    cycle: "monthly",
    used: false,
    owner: "Marketing"
  },
  {
    id: "sub-4",
    name: "Zendesk",
    cost: 320,
    cycle: "monthly",
    used: true,
    owner: "Support"
  },
  {
    id: "sub-5",
    name: "Slack",
    cost: 96,
    cycle: "yearly",
    used: true,
    owner: "Company"
  },
  {
    id: "sub-6",
    name: "Miro",
    cost: 10,
    cycle: "monthly",
    used: false,
    owner: "Product"
  }
];

const STORAGE_KEY = "saas-cost-optimizer-data";

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [form, setForm] = useState({
    name: "",
    cost: "",
    cycle: "monthly" as Cycle,
    owner: "",
    used: "used"
  });
  const [goal, setGoal] = useState(600);
  const [optimization, setOptimization] = useState(12);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSubscriptions(parsed);
      } catch (e) {
        console.error("Failed to parse stored data", e);
        setSubscriptions(initialSubscriptions);
      }
    } else {
      setSubscriptions(initialSubscriptions);
    }
  }, []);

  // Save to localStorage whenever subscriptions change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    }
  }, [subscriptions, mounted]);

  const metrics = useMemo(() => {
    const nameCounts = subscriptions.reduce<Record<string, number>>(
      (acc, sub) => {
        const key = sub.name.trim().toLowerCase();
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      {}
    );

    const seen = new Set<string>();
    let duplicateMonthly = 0;
    let unusedMonthly = 0;
    let totalMonthly = 0;
    let wasteMonthly = 0;

    subscriptions.forEach((sub) => {
      const monthly = toMonthly(sub.cost, sub.cycle);
      totalMonthly += monthly;
      if (!sub.used) unusedMonthly += monthly;
      const key = sub.name.trim().toLowerCase();
      const isDuplicate = seen.has(key);
      if (isDuplicate) duplicateMonthly += monthly;
      if (isDuplicate || !sub.used) wasteMonthly += monthly;
      seen.add(key);
    });
    const wasteRate = totalMonthly === 0 ? 0 : (wasteMonthly / totalMonthly) * 100;

    return {
      nameCounts,
      totalMonthly,
      unusedMonthly,
      duplicateMonthly,
      wasteMonthly,
      wasteRate
    };
  }, [subscriptions]);

  const projectedSavings = Math.max(
    0,
    metrics.wasteMonthly +
      (metrics.totalMonthly - metrics.wasteMonthly) * (optimization / 100)
  );
  const gap = Math.max(0, goal - projectedSavings);
  const nextMonthly = Math.max(0, metrics.totalMonthly - projectedSavings);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = form.name.trim();
    const cost = Number(form.cost);
    if (!trimmed || Number.isNaN(cost) || cost <= 0) return;

    setSubscriptions((prev) => [
      {
        id: `sub-${Date.now()}`,
        name: trimmed,
        cost,
        cycle: form.cycle,
        used: form.used === "used",
        owner: form.owner.trim() || "Unassigned"
      },
      ...prev
    ]);

    setForm({
      name: "",
      cost: "",
      cycle: "monthly",
      owner: "",
      used: "used"
    });
  };

  const previewMonthly = form.cost
    ? toMonthly(Number(form.cost), form.cycle)
    : 0;

  const exportToCSV = () => {
    const headers = ["Name", "Cost", "Cycle", "Owner", "Status", "Monthly Equivalent"];
    const rows = subscriptions.map(sub => [
      sub.name,
      sub.cost.toString(),
      sub.cycle,
      sub.owner,
      sub.used ? "Active" : "Unused",
      toMonthly(sub.cost, sub.cycle).toFixed(2)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `saas-costs-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

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
            <Link href="/about" className="text-sm text-[var(--muted)] transition hover:text-[var(--accent)]">
              About
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <span className="pill w-fit bg-[var(--surface-strong)] text-[var(--accent)]">
              SaaS Cost Optimizer
            </span>
            <h1 className="text-4xl font-semibold text-[var(--ink)] md:text-5xl">
              Keep every subscription
              <span className="text-[var(--accent)]"> accountable</span>.
            </h1>
            <p className="max-w-xl text-sm text-[var(--muted)] md:text-base">
              Track recurring tools, surface hidden waste, and model savings in
              real time. Built for finance and ops teams that need clarity fast.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="ghost-button"
            >
              Export CSV
            </button>
            <button className="ghost-button">Share</button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Monthly spend
                </p>
                <p className="heading-font text-4xl font-semibold text-[var(--ink)]">
                  {currency.format(metrics.totalMonthly)}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Annualized
                </p>
                <p className="text-lg font-semibold text-[var(--ink)]">
                  {currency.format(metrics.totalMonthly * 12)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Active tools
                </p>
                <p className="text-2xl font-semibold text-[var(--ink)]">
                  {subscriptions.length}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Unused value
                </p>
                <p className="text-2xl font-semibold text-[var(--accent-2)]">
                  {currency.format(metrics.unusedMonthly)}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Duplicate value
                </p>
                <p className="text-2xl font-semibold text-[var(--accent-3)]">
                  {currency.format(metrics.duplicateMonthly)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[var(--ink)]">
                  Waste exposure
                </span>
                <span className="text-[var(--muted)]">
                  {metrics.wasteRate.toFixed(1)}% of spend
                </span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-[var(--surface-strong)]">
                <div
                  className="h-2 rounded-full bg-[var(--accent-2)]"
                  style={{ width: `${Math.min(metrics.wasteRate, 100)}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-[var(--muted)]">
                Focused cleanup on unused and duplicate tools can recover up to
                {" "}
                <span className="font-semibold text-[var(--ink)]">
                  {currency.format(metrics.wasteMonthly)} per month
                </span>
                .
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card flex flex-col gap-5 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                Add subscription
              </p>
              <h2 className="heading-font text-2xl font-semibold text-[var(--ink)]">
                New tool intake
              </h2>
            </div>
            <label className="text-sm font-semibold text-[var(--ink)]">
              Tool name
              <input
                className="input mt-2"
                placeholder="e.g. HubSpot"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-[var(--ink)]">
                Cost
                <input
                  className="input mt-2"
                  placeholder="120"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.cost}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, cost: event.target.value }))
                  }
                />
              </label>
              <label className="text-sm font-semibold text-[var(--ink)]">
                Billing cycle
                <select
                  className="input mt-2"
                  value={form.cycle}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      cycle: event.target.value as Cycle
                    }))
                  }
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </label>
            </div>
            <label className="text-sm font-semibold text-[var(--ink)]">
              Team / owner
              <input
                className="input mt-2"
                placeholder="e.g. Revenue"
                value={form.owner}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, owner: event.target.value }))
                }
              />
            </label>
            <label className="text-sm font-semibold text-[var(--ink)]">
              Usage status
              <select
                className="input mt-2"
                value={form.used}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, used: event.target.value }))
                }
              >
                <option value="used">Used regularly</option>
                <option value="unused">Unused / dormant</option>
              </select>
            </label>
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-xs text-[var(--muted)]">
              Monthly equivalent: {currency.format(previewMonthly || 0)}
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Add subscription
            </button>
          </form>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="card flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Subscriptions
                </p>
                <h2 className="heading-font text-2xl font-semibold text-[var(--ink)]">
                  Live spend map
                </h2>
              </div>
              <div className="pill bg-[var(--surface-strong)] text-[var(--muted)]">
                {subscriptions.length} tools tracked
              </div>
            </div>

            <div className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)] md:grid md:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
              <span>Tool</span>
              <span>Billing</span>
              <span>Monthly</span>
              <span>Alerts</span>
            </div>

            <div className="flex flex-col gap-3">
              {subscriptions.map((sub) => {
                const key = sub.name.trim().toLowerCase();
                const isDuplicate = (metrics.nameCounts[key] ?? 0) > 1;
                const isUnused = !sub.used;
                const monthly = toMonthly(sub.cost, sub.cycle);

                return (
                  <div
                    key={sub.id}
                    className="grid gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 md:grid-cols-[1.6fr_1fr_1fr_1.2fr]"
                  >
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-[var(--ink)]">
                        {sub.name}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        Owner: {sub.owner}
                      </span>
                    </div>
                    <div className="text-sm text-[var(--muted)]">
                      {currency.format(sub.cost)} / {cycleLabels[sub.cycle]}
                    </div>
                    <div className="text-sm font-semibold text-[var(--ink)]">
                      {currency.format(monthly)}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {isUnused && (
                        <span className="pill border-[color:var(--accent-2-soft)] text-[var(--accent-2)]">
                          Unused
                        </span>
                      )}
                      {isDuplicate && (
                        <span className="pill border-[color:var(--accent-3-soft)] text-[var(--accent-3)]">
                          Duplicate
                        </span>
                      )}
                      {!isUnused && !isDuplicate && (
                        <span className="pill">Healthy</span>
                      )}
                      <button
                        type="button"
                        className="ml-auto text-xs font-semibold text-[var(--accent)]"
                        onClick={() =>
                          setSubscriptions((prev) =>
                            prev.map((item) =>
                              item.id === sub.id
                                ? { ...item, used: !item.used }
                                : item
                            )
                          )
                        }
                      >
                        Mark {sub.used ? "unused" : "used"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card flex flex-col gap-5 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                Savings calculator
              </p>
              <h2 className="heading-font text-2xl font-semibold text-[var(--ink)]">
                Build your savings plan
              </h2>
            </div>

            <label className="text-sm font-semibold text-[var(--ink)]">
              Target monthly savings
              <input
                className="input mt-2"
                type="number"
                min="0"
                step="50"
                value={goal}
                onChange={(event) => setGoal(Number(event.target.value))}
              />
            </label>

            <label className="text-sm font-semibold text-[var(--ink)]">
              Additional optimization
              <span className="mt-2 flex items-center justify-between text-xs text-[var(--muted)]">
                <span>{optimization}% from negotiation & downgrades</span>
                <span>
                  {currency.format(
                    (metrics.totalMonthly - metrics.wasteMonthly) *
                      (optimization / 100)
                  )}
                </span>
              </span>
              <input
                className="mt-2 w-full accent-[var(--accent)]"
                type="range"
                min="0"
                max="30"
                step="1"
                value={optimization}
                onChange={(event) => setOptimization(Number(event.target.value))}
              />
            </label>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted)]">Projected savings</span>
                <span className="text-lg font-semibold text-[var(--accent)]">
                  {currency.format(projectedSavings)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted)]">
                <span>New monthly spend</span>
                <span className="font-semibold text-[var(--ink)]">
                  {currency.format(nextMonthly)}
                </span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-white">
                <div
                  className="h-2 rounded-full bg-[var(--accent)]"
                  style={{
                    width: `${Math.min(
                      100,
                      (projectedSavings / (metrics.totalMonthly || 1)) * 100
                    )}%`
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-4 text-xs text-[var(--muted)]">
              {gap === 0 ? (
                <span>
                  You are on track to hit your savings goal this month.
                </span>
              ) : (
                <span>
                  Gap to target: {currency.format(gap)}. Focus on unused tools
                  and negotiate annual commitments.
                </span>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-4 text-xs text-[var(--muted)]">
              <p className="font-semibold text-[var(--ink)]">
                Recommended actions
              </p>
              <ul className="mt-2 space-y-2">
                <li>
                  Prioritize {currency.format(metrics.unusedMonthly)} in unused
                  subscriptions.
                </li>
                <li>
                  Consolidate duplicates to unlock{" "}
                  {currency.format(metrics.duplicateMonthly)} monthly.
                </li>
                <li>
                  Lock in annual deals for core tools once usage is verified.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
