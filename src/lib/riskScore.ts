/**
 * Renewal Risk Score Calculator
 * 
 * Fully deterministic scoring system (0-100) to prioritize subscription review.
 * No AI, no predictions - just clear, explainable logic.
 */

type Cycle = "monthly" | "quarterly" | "yearly" | "weekly";

export interface Subscription {
  id: number;
  name: string;
  cost: number;
  cycle: Cycle;
  category: string;
  renewalDate?: string;
  autoRenew?: boolean;
  notes?: string;
}

export interface RiskScore {
  score: number;
  level: "Low" | "Medium" | "High" | "Critical";
  explanation: string[];
}

/**
 * Calculate the renewal risk score for a subscription
 * Returns a score from 0-100 and a breakdown of factors
 */
export function calculateRiskScore(subscription: Subscription): RiskScore {
  let score = 0;
  const explanation: string[] = [];

  // Factor 1: Auto-renew status (+20 points)
  if (subscription.autoRenew) {
    score += 20;
    explanation.push("Auto-renew enabled");
  }

  // Factor 2: Renewal date proximity
  if (!subscription.renewalDate) {
    score += 25;
    explanation.push("Renewal date unknown");
  } else {
    const daysUntilRenewal = getDaysUntilRenewal(subscription.renewalDate);
    
    if (daysUntilRenewal < 30) {
      score += 30;
      explanation.push(`Renewal in ${Math.floor(daysUntilRenewal)} days`);
    } else if (daysUntilRenewal < 60) {
      score += 20;
      explanation.push(`Renewal in ${Math.floor(daysUntilRenewal)} days`);
    } else if (daysUntilRenewal < 90) {
      score += 10;
      explanation.push(`Renewal in ${Math.floor(daysUntilRenewal)} days`);
    }
    // >90 days adds 0 points
  }

  // Factor 3: Billing cycle
  if (subscription.cycle === "yearly") {
    score += 15;
    explanation.push("Annual billing");
  } else if (subscription.cycle === "quarterly") {
    score += 10;
    explanation.push("Quarterly billing");
  } else {
    score += 5;
    explanation.push("Monthly billing");
  }

  // Factor 4: Cost impact (normalize to monthly equivalent)
  const monthlyCost = normalizeToMonthly(subscription.cost, subscription.cycle);
  if (monthlyCost > 100) {
    score += 15;
    explanation.push(`€${subscription.cost}/${subscription.cycle.slice(0, -2)} (>€100/mo)`);
  } else if (monthlyCost >= 50) {
    score += 10;
    explanation.push(`€${subscription.cost}/${subscription.cycle.slice(0, -2)} (€50-100/mo)`);
  } else {
    score += 5;
    explanation.push(`€${subscription.cost}/${subscription.cycle.slice(0, -2)} (<€50/mo)`);
  }

  // Cap at 100
  score = Math.min(score, 100);

  // Determine risk level
  let level: "Low" | "Medium" | "High" | "Critical";
  if (score >= 80) {
    level = "Critical";
  } else if (score >= 60) {
    level = "High";
  } else if (score >= 30) {
    level = "Medium";
  } else {
    level = "Low";
  }

  return { score, level, explanation };
}

/**
 * Get days until renewal date
 */
function getDaysUntilRenewal(renewalDate: string): number {
  const renewal = new Date(renewalDate);
  const today = new Date();
  const diffTime = renewal.getTime() - today.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays;
}

/**
 * Normalize any billing cycle to monthly cost
 */
function normalizeToMonthly(cost: number, cycle: Cycle): number {
  switch (cycle) {
    case "weekly":
      return cost * 4.33;
    case "monthly":
      return cost;
    case "quarterly":
      return cost / 3;
    case "yearly":
      return cost / 12;
    default:
      return cost;
  }
}

/**
 * Get color class for risk level
 */
export function getRiskColorClass(level: "Low" | "Medium" | "High" | "Critical"): string {
  switch (level) {
    case "Low":
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700";
    case "Medium":
      return "bg-gray-200 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600";
    case "High":
      return "bg-gray-300 text-gray-900 border-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-500";
    case "Critical":
      return "bg-gray-400 text-white border-gray-500 dark:bg-gray-600 dark:text-white dark:border-gray-400";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700";
  }
}

/**
 * Sort subscriptions by risk score (highest first)
 */
export function sortByRiskScore(subscriptions: Subscription[]): Subscription[] {
  return [...subscriptions].sort((a, b) => {
    const scoreA = calculateRiskScore(a).score;
    const scoreB = calculateRiskScore(b).score;
    return scoreB - scoreA; // Descending order
  });
}

/**
 * Get top N subscriptions by risk score
 */
export function getTopRisks(subscriptions: Subscription[], limit: number = 3): Array<{ sub: Subscription; risk: RiskScore }> {
  const withScores = subscriptions.map(sub => ({
    sub,
    risk: calculateRiskScore(sub)
  }));
  
  return withScores
    .sort((a, b) => b.risk.score - a.risk.score)
    .slice(0, limit);
}
