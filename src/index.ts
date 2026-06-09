import { buildBidFlowReport, disclaimer, validateBidResponse } from "./bidflow.js";
import { syntheticBid } from "./seedData.js";

const validationErrors = validateBidResponse(syntheticBid);

if (validationErrors.length > 0) {
  console.error("Bidflow seed data is invalid:");
  for (const error of validationErrors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  const report = buildBidFlowReport(syntheticBid);

  console.log("Bidflow Synthetic Bid Response Checker");
  console.log(disclaimer);
  console.log("");
  console.log(`Bid: ${report.name} (${report.bidId})`);
  console.log(`Fictional buyer: ${report.fictionalBuyer}`);
  console.log(`Response lead: ${report.responseLead}`);
  console.log(`Status: ${report.status}`);
  console.log(`Readiness score: ${report.readinessScore}/100`);
  console.log(`Owner coverage: ${report.ownerCoveragePercent}%`);
  console.log(`Evidence completion: ${report.evidenceCompletionPercent}%`);
  console.log(`High deadline risks: ${report.highDeadlineRiskCount}`);
  console.log(`Blocked requirements: ${report.blockedRequirementCount}`);
  console.log("");
  console.log("Requirement checks:");

  for (const check of report.checks) {
    const marker = check.ready ? "OK" : "Needs attention";
    console.log(
      `- ${marker}: ${check.id} ${check.label} | owner=${check.ownerCovered ? "covered" : "missing"} | evidence=${check.approvedEvidenceCount}/${check.totalEvidenceCount} approved | deadline=${check.deadlineRisk}`
    );
  }
}
