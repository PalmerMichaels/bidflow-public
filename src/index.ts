#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import { syntheticBids } from "./bids.js";
import { formatBoard, prioritizeBids, type PrioritizedBid } from "./scoring.js";

export { syntheticBids } from "./bids.js";
export { daysUntilDue, formatBoard, nextActionFor, prioritizeBids, scoreBid } from "./scoring.js";

export type BidflowReport = {
  generatedFor: string;
  urgentCount: number;
  priorities: PrioritizedBid[];
};

export const cleanRoomDisclaimer =
  "Clean-room public demo using synthetic fictional bid data only; not procurement, financial, compliance, legal, or production bidding advice.";

export function buildBidflowReport(today = new Date()): BidflowReport {
  const priorities = prioritizeBids(syntheticBids, today);

  return {
    generatedFor: today.toISOString().slice(0, 10),
    urgentCount: priorities.filter((bid) => bid.daysUntilDue <= 3 && bid.stage !== "submitted").length,
    priorities
  };
}

export function renderBidflowReport(report = buildBidflowReport()): string {
  return [
    "Bidflow synthetic priority board",
    cleanRoomDisclaimer,
    `Generated for: ${report.generatedFor}`,
    `Urgent active bids: ${report.urgentCount}`,
    "",
    formatBoard(report.priorities)
  ].join("\n");
}

export function main(argv = process.argv.slice(2)): void {
  const todayArg = argv.find((arg) => arg.startsWith("--today="));
  const today = todayArg ? new Date(`${todayArg.slice("--today=".length)}T00:00:00Z`) : new Date();

  console.log(renderBidflowReport(buildBidflowReport(today)));
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedPath) {
  main();
}
