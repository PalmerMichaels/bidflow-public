#!/usr/bin/env node
import { syntheticBids } from "./bids.ts";
import { formatBoard, prioritizeBids } from "./scoring.ts";

const todayArg = process.argv.find((arg) => arg.startsWith("--today="));
const today = todayArg ? new Date(`${todayArg.slice("--today=".length)}T00:00:00Z`) : new Date();

if (Number.isNaN(today.getTime())) {
  console.error("Invalid --today date. Use YYYY-MM-DD.");
  process.exitCode = 1;
} else {
  console.log(formatBoard(prioritizeBids(syntheticBids, today)));
}
