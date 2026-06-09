#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import { syntheticEstimateCatalog, syntheticPlanPackages } from "./data.js";
import { buildTakeoffWorkspace, renderWorkspace } from "./takeoff.js";

export { syntheticEstimateCatalog, syntheticPlanPackages } from "./data.js";
export {
  buildDashboards,
  buildExceptions,
  buildMockIntegrations,
  buildTakeoffWorkspace,
  compareEstimates,
  extractLineItems,
  renderWorkspace,
  reviewLineItems,
  type BidPackageDashboard,
  type EstimateCatalog,
  type EstimateComparison,
  type ExceptionRecord,
  type ExtractedLineItem,
  type MockIntegrationEvent,
  type PlanCallout,
  type PlanPackage,
  type PlanSheet,
  type ReviewFinding,
  type TakeoffWorkspace
} from "./takeoff.js";

export const cleanRoomDisclaimer =
  "Clean-room public demo using synthetic electrical plan packages only; not procurement, engineering, financial, compliance, legal, or production bidding advice.";

export function main(argv = process.argv.slice(2)): void {
  const todayArg = argv.find((arg) => arg.startsWith("--today="));
  const generatedFor = todayArg ? todayArg.slice("--today=".length) : new Date().toISOString().slice(0, 10);
  const workspace = buildTakeoffWorkspace(syntheticPlanPackages, syntheticEstimateCatalog, generatedFor);

  console.log(`${renderWorkspace(workspace)}\n\n${cleanRoomDisclaimer}`);
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedPath) {
  main();
}
