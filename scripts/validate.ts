import { syntheticEstimateCatalog, syntheticPlanPackages } from "../src/data.js";
import { buildTakeoffWorkspace, type PlanPackage } from "../src/takeoff.js";

function assertValidPackage(planPackage: PlanPackage): void {
  const requiredText = [planPackage.id, planPackage.name, planPackage.dueDate, planPackage.estimator];
  if (requiredText.some((value) => value.trim().length === 0)) {
    throw new Error(`Plan package ${planPackage.id || "unknown"} has a blank required text field`);
  }

  if (!/^PKG-E-\d{3}$/.test(planPackage.id)) throw new Error(`Plan package ${planPackage.id} has an invalid id`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(planPackage.dueDate)) throw new Error(`Plan package ${planPackage.id} has an invalid due date`);
  if (planPackage.sheets.length === 0) throw new Error(`Plan package ${planPackage.id} has no sheets`);

  for (const sheet of planPackage.sheets) {
    if (!sheet.id || !sheet.title || !sheet.area) throw new Error(`Plan package ${planPackage.id} has an incomplete sheet`);
    if (sheet.callouts.length === 0) throw new Error(`Sheet ${sheet.id} has no callouts`);

    for (const callout of sheet.callouts) {
      if (!syntheticEstimateCatalog.itemCosts[callout.code]) throw new Error(`Missing cost catalog entry for ${callout.code}`);
      if (callout.quantity <= 0) throw new Error(`Callout ${callout.code} has invalid quantity`);
      if (callout.confidence < 0 || callout.confidence > 1) throw new Error(`Callout ${callout.code} confidence must be 0-1`);
    }
  }
}

for (const planPackage of syntheticPlanPackages) assertValidPackage(planPackage);

const workspace = buildTakeoffWorkspace(syntheticPlanPackages, syntheticEstimateCatalog, "2026-06-09");
if (workspace.lineItems.length < 12) throw new Error("Expected at least 12 extracted line items");
if (workspace.dashboards.length !== syntheticPlanPackages.length) throw new Error("Dashboard count must match package count");
if (!workspace.exceptions.some((exception) => exception.category === "scope-gap")) throw new Error("Expected a synthetic scope-gap exception");
if (!workspace.integrations.some((event) => event.target === "estimating-csv" && event.status === "held")) {
  throw new Error("Expected mocked estimating export to be held while blockers exist");
}

console.log(`Validation passed for ${workspace.lineItems.length} synthetic electrical takeoff line items.`);
