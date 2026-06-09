import assert from "node:assert/strict";
import { buildBidFlowReport, disclaimer, validateBidResponse } from "../src/bidflow.js";
import { syntheticBid } from "../src/seedData.js";

const errors = validateBidResponse(syntheticBid);
assert.deepEqual(errors, []);

const report = buildBidFlowReport(syntheticBid);
assert.equal(report.readinessScore, 71);
assert.equal(report.status, "needs-attention");
assert.equal(report.ownerCoveragePercent, 80);
assert.equal(report.evidenceCompletionPercent, 60);
assert.equal(report.highDeadlineRiskCount, 1);
assert.equal(report.blockedRequirementCount, 2);

const commercialCheck = report.checks.find((check) => check.id === "req-004");
assert.ok(commercialCheck);
assert.equal(commercialCheck.ownerCovered, false);
assert.equal(commercialCheck.missingEvidenceCount, 1);
assert.equal(commercialCheck.deadlineRisk, "high");

assert.match(disclaimer, /Not legal, procurement, compliance, or financial advice/);

console.log("Validation passed: synthetic bidflow readiness checks are deterministic.");
