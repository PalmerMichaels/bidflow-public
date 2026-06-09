import { syntheticBids, type Bid } from "../src/bids.ts";
import { prioritizeBids } from "../src/scoring.ts";

function assertValidBid(bid: Bid): void {
  const requiredText = [bid.id, bid.buyer, bid.title, bid.stage, bid.dueDate];
  if (requiredText.some((value) => value.trim().length === 0)) {
    throw new Error(`Bid ${bid.id || "unknown"} has a blank required text field`);
  }

  if (!/^BID-\d{4}$/.test(bid.id)) throw new Error(`Bid ${bid.id} has an invalid id`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(bid.dueDate)) throw new Error(`Bid ${bid.id} has an invalid due date`);
  if (bid.estimatedValue <= 0 || bid.workloadHours <= 0) throw new Error(`Bid ${bid.id} has invalid effort/value numbers`);

  for (const [label, value] of [
    ["fitScore", bid.fitScore],
    ["relationshipScore", bid.relationshipScore],
    ["riskScore", bid.riskScore]
  ] as const) {
    if (value < 0 || value > 100) throw new Error(`Bid ${bid.id} ${label} must be 0-100`);
  }
}

for (const bid of syntheticBids) assertValidBid(bid);

const board = prioritizeBids(syntheticBids, new Date("2026-06-09T00:00:00Z"));
if (board.length !== syntheticBids.length) throw new Error("Prioritized board lost bids");
if (new Set(board.map((bid) => bid.id)).size !== board.length) throw new Error("Bid ids must be unique");

console.log(`Validation passed for ${board.length} synthetic bids.`);
