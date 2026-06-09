import type { Bid } from "./bids.ts";

export type PrioritizedBid = Bid & {
  daysUntilDue: number;
  priorityScore: number;
  nextAction: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function daysUntilDue(dueDate: string, today = new Date()): number {
  const due = new Date(`${dueDate}T00:00:00Z`);
  const current = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  return Math.ceil((due.getTime() - current.getTime()) / DAY_MS);
}

export function scoreBid(bid: Bid, today = new Date()): number {
  const dueIn = daysUntilDue(bid.dueDate, today);
  const urgency = Math.max(0, 100 - Math.max(dueIn, 0) * 7);
  const valueScore = Math.min(100, bid.estimatedValue / 1000);
  const marginScore = Math.min(100, bid.marginPercent * 2.5);
  const workloadDrag = Math.min(45, bid.workloadHours * 0.55);
  const submittedDrag = bid.stage === "submitted" ? 18 : 0;

  const score =
    urgency * 0.24 +
    valueScore * 0.16 +
    marginScore * 0.16 +
    bid.fitScore * 0.2 +
    bid.relationshipScore * 0.12 -
    bid.riskScore * 0.1 -
    workloadDrag -
    submittedDrag;

  return Math.round(Math.max(0, score) * 10) / 10;
}

export function nextActionFor(bid: Bid, daysUntil: number, score: number): string {
  if (bid.stage === "submitted") return "Monitor buyer response and capture follow-up notes";
  if (daysUntil < 0) return "Archive or confirm extension before further work";
  if (daysUntil <= 3) return "Finalize response, approvals, and submission checklist";
  if (score >= 55 && bid.stage === "new") return "Schedule qualification call and assign proposal owner";
  if (bid.riskScore >= 45) return "Resolve risk assumptions before committing more drafting time";
  if (bid.stage === "research") return "Complete requirement matrix and evidence list";
  if (bid.stage === "drafting") return "Draft value narrative and pricing assumptions";
  return "Review gaps and prepare final edits";
}

export function prioritizeBids(bids: Bid[], today = new Date()): PrioritizedBid[] {
  return bids
    .map((bid) => {
      const daysUntil = daysUntilDue(bid.dueDate, today);
      const priorityScore = scoreBid(bid, today);
      return {
        ...bid,
        daysUntilDue: daysUntil,
        priorityScore,
        nextAction: nextActionFor(bid, daysUntil, priorityScore)
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore || a.daysUntilDue - b.daysUntilDue);
}

export function formatBoard(bids: PrioritizedBid[]): string {
  const rows = bids.map((bid, index) => {
    const due = bid.daysUntilDue < 0 ? `${Math.abs(bid.daysUntilDue)}d late` : `${bid.daysUntilDue}d`;
    return `${index + 1}. ${bid.id} | ${bid.buyer} | score ${bid.priorityScore} | due ${due} | ${bid.nextAction}`;
  });

  return ["Bidflow synthetic priority board", "", ...rows].join("\n");
}
