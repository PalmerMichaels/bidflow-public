import assert from "node:assert/strict";
import test from "node:test";
import { syntheticEstimateCatalog, syntheticPlanPackages } from "../src/data.js";
import { buildTakeoffWorkspace, compareEstimates, extractLineItems, reviewLineItems } from "../src/takeoff.js";

test("extracts deterministic electrical line items from synthetic plan packages", () => {
  const items = extractLineItems(syntheticPlanPackages, syntheticEstimateCatalog);

  assert.equal(items.length, 15);
  assert.equal(items[0].id, "PKG-E-410-E1.01-1");
  assert.equal(items[0].materialTotal, 7770);
  assert.equal(items[0].laborHours, 35.7);
});

test("review flags low-confidence and unknown electrical scope", () => {
  const items = extractLineItems(syntheticPlanPackages, syntheticEstimateCatalog);
  const findings = reviewLineItems(items);

  assert.ok(findings.some((finding) => finding.severity === "blocker" && finding.message.includes("Unlabeled electrical scope")));
  assert.ok(findings.some((finding) => finding.message.includes("confidence is 61%")));
});

test("workspace includes dashboards, estimate comparisons, exceptions, and mocked integrations", () => {
  const workspace = buildTakeoffWorkspace(syntheticPlanPackages, syntheticEstimateCatalog, "2026-06-09");
  const blockedDashboard = workspace.dashboards.find((dashboard) => dashboard.packageId === "PKG-E-422");

  assert.equal(workspace.generatedFor, "2026-06-09");
  assert.equal(workspace.dashboards.length, 3);
  assert.equal(blockedDashboard?.readiness, "blocked");
  assert.ok(workspace.comparisons.some((comparison) => comparison.packageId === "PKG-E-410"));
  assert.ok(workspace.exceptions.some((exception) => exception.category === "scope-gap"));
  assert.ok(workspace.integrations.some((event) => event.target === "estimating-csv" && event.status === "held"));
});

test("estimate comparisons report signed variance against synthetic baselines", () => {
  const workspace = buildTakeoffWorkspace(syntheticPlanPackages, syntheticEstimateCatalog, "2026-06-09");
  const comparisons = compareEstimates(workspace.dashboards, syntheticEstimateCatalog);
  const marketComparison = comparisons.find((comparison) => comparison.packageId === "PKG-E-422");

  assert.ok(marketComparison);
  assert.equal(marketComparison.baselineMaterial, 52000);
  assert.ok(marketComparison.materialDeltaPercent < 0);
});
