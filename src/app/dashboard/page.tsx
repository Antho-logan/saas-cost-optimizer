"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  calculateRiskScore,
  getRiskColorClass,
  sortByRiskScore,
  getTopRisks,
  type RiskScore
} from "@/lib/riskScore";

type Cycle = "monthly" | "quarterly" | "yearly";

type Subscription = {
  id: number;
  name: string;
  category: string;
  cost: number;
  cycle: Cycle;
  users: number;
  renewalDate: string;
  status: "active" | "cancelled" | "pending";
  usage?: number;
  lastUsed?: string;
};

const cycleMultipliers: Record<Cycle, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

const STORAGE_KEY = "saas_optimizer_data";

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [newSub, setNewSub] = useState<Partial<Subscription>>({
    name: "",
    category: "",
    cost: 0,
    users: 1,
    renewalDate: "",
    status: "active",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSubscriptions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  // Save to localStorage whenever subscriptions change
  useEffect(() => {
    if (subscriptions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    }
  }, [subscriptions]);

  const handleAddSub = () => {
    if (!newSub.name || !newSub.category || !newSub.cost) return;

    const sub: Subscription = {
      id: Date.now(),
      name: newSub.name,
      category: newSub.category,
      cost: Number(newSub.cost),
      cycle: cycle,
      users: Number(newSub.users || 1),
      renewalDate: newSub.renewalDate || "",
      status: newSub.status as "active" | "cancelled" | "pending",
      usage: Math.floor(Math.random() * 100),
      lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setSubscriptions([...subscriptions, sub]);
    setNewSub({ name: "", category: "", cost: 0, users: 1, renewalDate: "", status: "active" });
    setShowAddForm(false);
  };

  const handleDeleteSub = (id: number) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
  };

  const handleStatusChange = (id: number, status: Subscription["status"]) => {
    setSubscriptions(subscriptions.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const handleEditSub = (id: number, field: keyof Subscription, value: string | number) => {
    setSubscriptions(subscriptions.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  // Core calculations
  const totals = useMemo(() => {
    const active = subscriptions.filter((s) => s.status === "active");
    return {
      count: active.length,
      monthlyCost: active.reduce((sum, s) => sum + s.cost, 0),
    };
  }, [subscriptions, cycle]);

  const projectedCost = totals.monthlyCost * cycleMultipliers[cycle];

  // Risk calculations
  const topRisks = useMemo(() => getTopRisks(subscriptions), [subscriptions]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown = subscriptions.reduce((acc, sub) => {
      if (sub.status !== "active") return acc;
      acc[sub.category] = (acc[sub.category] || 0) + sub.cost;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(breakdown)
      .map(([category, cost]) => ({ category, cost, percentage: (cost / totals.monthlyCost) * 100 }))
      .sort((a, b) => b.cost - a.cost);
  }, [subscriptions, totals.monthlyCost]);

  // Export functions
  const exportCSV = () => {
    const headers = ["Name", "Category", "Monthly Cost", "Users", "Renewal Date", "Status", "Usage %", "Last Used"];
    const rows = subscriptions.map(s => [
      s.name,
      s.category,
      s.cost.toFixed(2),
      s.users,
      s.renewalDate || "N/A",
      s.status,
      s.usage ? s.usage.toFixed(0) : "N/A",
      s.lastUsed || "N/A"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saas-costs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(subscriptions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saas-costs-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
  };

  // Sample data helper
  const loadSampleData = () => {
    const sampleData: Subscription[] = [
      { id: 1, name: "Linear", category: "Development", cost: 12, cycle: "monthly", users: 8, renewalDate: "2025-04-15", status: "active", usage: 95, lastUsed: "2025-01-28" },
      { id: 2, name: "Figma", category: "Design", cost: 45, cycle: "monthly", users: 4, renewalDate: "2025-06-01", status: "active", usage: 88, lastUsed: "2025-01-29" },
      { id: 3, name: "Notion", category: "Productivity", cost: 10, cycle: "monthly", users: 12, renewalDate: "2025-03-20", status: "active", usage: 72, lastUsed: "2025-01-30" },
      { id: 4, name: "Slack", category: "Communication", cost: 8, cycle: "monthly", users: 15, renewalDate: "2025-05-10", status: "active", usage: 91, lastUsed: "2025-01-31" },
      { id: 5, name: "Vercel", category: "Infrastructure", cost: 20, cycle: "monthly", users: 3, renewalDate: "2025-07-01", status: "active", usage: 85, lastUsed: "2025-01-28" },
      { id: 6, name: "AWS", category: "Infrastructure", cost: 150, cycle: "monthly", users: 5, renewalDate: "2025-04-01", status: "active", usage: 78, lastUsed: "2025-01-29" },
      { id: 7, name: "HubSpot", category: "Marketing", cost: 50, cycle: "monthly", users: 6, renewalDate: "2025-08-15", status: "active", usage: 45, lastUsed: "2025-01-10" },
      { id: 8, name: "Dropbox", category: "Storage", cost: 15, cycle: "monthly", users: 10, renewalDate: "2025-02-28", status: "active", usage: 62, lastUsed: "2025-01-25" },
      { id: 9, name: "Zoom", category: "Communication", cost: 14, cycle: "monthly", users: 20, renewalDate: "2025-09-01", status: "active", usage: 67, lastUsed: "2025-01-27" },
      { id: 10, name: "Jira", category: "Development", cost: 14, cycle: "monthly", users: 12, renewalDate: "2025-05-15", status: "pending", usage: 55, lastUsed: "2025-01-20" },
      { id: 11, name: "Miro", category: "Design", cost: 8, cycle: "monthly", users: 7, renewalDate: "2025-06-20", status: "active", usage: 41, lastUsed: "2025-01-15" },
      { id: 12, name: "Salesforce", category: "CRM", cost: 25, cycle: "monthly", users: 5, renewalDate: "2025-04-10", status: "active", usage: 38, lastUsed: "2025-01-18" },
    ];

    setSubscriptions(sampleData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            SaaS Cost Optimizer
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              About
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track and optimize your SaaS subscriptions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={cycle}
              onChange={(e) => setCycle(e.target.value as Cycle)}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-100 px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white transition-colors"
            >
              {showAddForm ? "Cancel" : "Add Subscription"}
            </button>

            <button
              onClick={() => setShowExport(!showExport)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Export
            </button>

            {subscriptions.length === 0 && (
              <button
                onClick={loadSampleData}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                Load Sample Data
              </button>
            )}
          </div>
        </div>

        {/* Export Dropdown */}
        {showExport && (
          <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
            <div className="flex gap-3">
              <button
                onClick={exportCSV}
                className="inline-flex items-center justify-center rounded-lg bg-gray-600 dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-white dark:text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                Export as CSV
              </button>
              <button
                onClick={exportJSON}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Export as JSON
              </button>
            </div>
          </div>
        )}

        {/* Add Subscription Form */}
        {showAddForm && (
          <div className="mb-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-4">Add New Subscription</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={newSub.name || ""}
                  onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
                  placeholder="e.g., Linear"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <input
                  type="text"
                  value={newSub.category || ""}
                  onChange={(e) => setNewSub({ ...newSub, category: e.target.value })}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
                  placeholder="e.g., Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Cost ($)</label>
                <input
                  type="number"
                  value={newSub.cost || ""}
                  onChange={(e) => setNewSub({ ...newSub, cost: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Users</label>
                <input
                  type="number"
                  value={newSub.users || 1}
                  onChange={(e) => setNewSub({ ...newSub, users: parseInt(e.target.value) || 1 })}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
                  placeholder="1"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Renewal Date</label>
                <input
                  type="date"
                  value={newSub.renewalDate || ""}
                  onChange={(e) => setNewSub({ ...newSub, renewalDate: e.target.value })}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={newSub.status || "active"}
                  onChange={(e) => setNewSub({ ...newSub, status: e.target.value as Subscription["status"] })}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
                >
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddSub}
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-100 px-6 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white transition-colors"
              >
                Add Subscription
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Subscriptions</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">{totals.count}</p>
              </div>
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
                <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Cost</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">${totals.monthlyCost.toFixed(2)}</p>
              </div>
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
                <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {cycle === "monthly" ? "Monthly" : cycle === "quarterly" ? "Quarterly" : "Yearly"} Projected
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">${projectedCost.toFixed(2)}</p>
              </div>
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
                <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Alerts */}
        {topRisks.length > 0 && (
          <div className="mb-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">⚠️ Cost Optimization Opportunities</h2>
            <div className="space-y-3">
              {topRisks.slice(0, 3).map((risk) => {
                const riskColorClass = getRiskColorClass(risk.risk.level);
                return (
                  <div key={risk.sub.id} className="flex items-start gap-3">
                    <span className="text-gray-600 dark:text-gray-400 mt-0.5">•</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{risk.sub.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{risk.risk.explanation.join(" • ")}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${riskColorClass}`}>
                      {risk.risk.score}/10
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <div className="mb-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">Cost by Category</h2>
            <div className="space-y-3">
              {categoryBreakdown.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.category}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                      ${cat.cost.toFixed(2)} ({cat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full rounded-full bg-gray-200 dark:bg-gray-800 h-2">
                    <div
                      className="bg-gray-600 dark:bg-gray-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscriptions Table */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Per User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Renewal</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-4">
                        <svg className="h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-1">No subscriptions yet</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Add your first subscription or load sample data to get started</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortByRiskScore(subscriptions).map((sub) => {
                    const riskScore = calculateRiskScore(sub);
                    const riskColorClass = getRiskColorClass(riskScore.level);
                    const perUserCost = sub.seats > 0 ? sub.cost / sub.seats : 0;

                    return (
                      <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => handleEditSub(sub.id, "name", e.target.value)}
                            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 rounded px-1 py-0.5"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={sub.category}
                            onChange={(e) => handleEditSub(sub.id, "category", e.target.value)}
                            className="w-full bg-transparent text-sm text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 rounded px-1 py-0.5"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={sub.cost}
                            onChange={(e) => handleEditSub(sub.id, "cost", parseFloat(e.target.value) || 0)}
                            className="w-24 bg-transparent text-sm font-semibold text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 rounded px-1 py-0.5"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={sub.users}
                            onChange={(e) => handleEditSub(sub.id, "users", parseInt(e.target.value) || 1)}
                            className="w-16 bg-transparent text-sm text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 rounded px-1 py-0.5"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">${perUserCost.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <input
                            type="date"
                            value={sub.renewalDate}
                            onChange={(e) => handleEditSub(sub.id, "renewalDate", e.target.value)}
                            className="bg-transparent text-sm text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 rounded px-1 py-0.5"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 rounded-full bg-gray-200 dark:bg-gray-800 h-1.5">
                              <div
                                className="bg-gray-600 dark:bg-gray-500 h-1.5 rounded-full"
                                style={{ width: `${(sub.usage || 0)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{sub.usage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={sub.status}
                            onChange={(e) => handleStatusChange(sub.id, e.target.value as Subscription["status"])}
                            className="rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
                          >
                            <option value="active" className="text-green-700 dark:text-green-400">Active</option>
                            <option value="cancelled" className="text-red-700 dark:text-red-400">Cancelled</option>
                            <option value="pending" className="text-yellow-700 dark:text-yellow-400">Pending</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${riskColorClass}`}>
                            {riskScore}/10
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteSub(sub.id)}
                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Data stored locally in your browser • No account required</p>
        </footer>
      </div>
    </main>
  );
}
