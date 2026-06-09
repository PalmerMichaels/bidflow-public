export type EvidenceStatus = "approved" | "draft" | "missing";
export type RequirementPriority = "critical" | "standard" | "optional";
export type RequirementCategory = "security" | "delivery" | "support" | "commercial";
export type DeadlineRisk = "low" | "medium" | "high";

export type Evidence = {
  id: string;
  title: string;
  status: EvidenceStatus;
};

export type Requirement = {
  id: string;
  label: string;
  category: RequirementCategory;
  priority: RequirementPriority;
  owner?: string;
  evidenceIds: string[];
  dueInDays: number;
};

export type BidResponse = {
  id: string;
  name: string;
  fictionalBuyer: string;
  responseLead: string;
  evidence: Evidence[];
  requirements: Requirement[];
};

export type RequirementCheck = {
  id: string;
  label: string;
  ownerCovered: boolean;
  approvedEvidenceCount: number;
  totalEvidenceCount: number;
  missingEvidenceCount: number;
  deadlineRisk: DeadlineRisk;
  ready: boolean;
};

export type BidFlowReport = {
  bidId: string;
  name: string;
  fictionalBuyer: string;
  responseLead: string;
  status: "ready" | "needs-attention";
  readinessScore: number;
  ownerCoveragePercent: number;
  evidenceCompletionPercent: number;
  highDeadlineRiskCount: number;
  blockedRequirementCount: number;
  checks: RequirementCheck[];
};

export const disclaimer =
  "Clean-room demo using fictional synthetic data only. Not legal, procurement, compliance, or financial advice; do not use for regulated decisions.";

export function validateBidResponse(response: BidResponse): string[] {
  const errors: string[] = [];
  const evidenceIds = new Set(response.evidence.map((item) => item.id));

  if (!response.id.trim()) errors.push("bid id is required");
  if (!response.name.trim()) errors.push("bid name is required");
  if (!response.fictionalBuyer.trim()) errors.push("fictional buyer is required");
  if (!response.responseLead.trim()) errors.push("response lead is required");
  if (response.evidence.length === 0) errors.push("at least one evidence item is required");
  if (response.requirements.length === 0) errors.push("at least one requirement is required");

  for (const evidence of response.evidence) {
    if (!evidence.id.trim()) errors.push("evidence id is required");
    if (!evidence.title.trim()) errors.push(`evidence ${evidence.id} title is required`);
  }

  for (const requirement of response.requirements) {
    if (!requirement.id.trim()) errors.push("requirement id is required");
    if (!requirement.label.trim()) errors.push(`requirement ${requirement.id} label is required`);
    if (requirement.dueInDays < 0) errors.push(`requirement ${requirement.id} dueInDays must be non-negative`);

    for (const evidenceId of requirement.evidenceIds) {
      if (!evidenceIds.has(evidenceId)) {
        errors.push(`requirement ${requirement.id} references missing evidence ${evidenceId}`);
      }
    }
  }

  return errors;
}

export function buildBidFlowReport(response: BidResponse): BidFlowReport {
  const checks = response.requirements.map((requirement) => buildRequirementCheck(requirement, response.evidence));
  const ownerCoveragePercent = percent(checks.filter((check) => check.ownerCovered).length, checks.length);
  const evidenceCompletionPercent = percent(
    response.evidence.filter((evidence) => evidence.status === "approved").length,
    response.evidence.length
  );
  const highDeadlineRiskCount = checks.filter((check) => check.deadlineRisk === "high").length;
  const deadlineHealthPercent = percent(checks.length - highDeadlineRiskCount, checks.length);
  const blockedRequirementCount = checks.filter((check) => !check.ready).length;
  const readinessScore = Math.round(
    ownerCoveragePercent * 0.35 + evidenceCompletionPercent * 0.45 + deadlineHealthPercent * 0.2
  );

  return {
    bidId: response.id,
    name: response.name,
    fictionalBuyer: response.fictionalBuyer,
    responseLead: response.responseLead,
    status: readinessScore >= 85 && blockedRequirementCount === 0 ? "ready" : "needs-attention",
    readinessScore,
    ownerCoveragePercent,
    evidenceCompletionPercent,
    highDeadlineRiskCount,
    blockedRequirementCount,
    checks
  };
}

function buildRequirementCheck(requirement: Requirement, evidence: Evidence[]): RequirementCheck {
  const linkedEvidence = requirement.evidenceIds.map((id) => evidence.find((item) => item.id === id));
  const approvedEvidenceCount = linkedEvidence.filter((item) => item?.status === "approved").length;
  const totalEvidenceCount = requirement.evidenceIds.length;
  const missingEvidenceCount = totalEvidenceCount - approvedEvidenceCount;
  const ownerCovered = Boolean(requirement.owner?.trim());
  const ready = ownerCovered && missingEvidenceCount === 0;

  return {
    id: requirement.id,
    label: requirement.label,
    ownerCovered,
    approvedEvidenceCount,
    totalEvidenceCount,
    missingEvidenceCount,
    deadlineRisk: getDeadlineRisk(requirement.dueInDays),
    ready
  };
}

function getDeadlineRisk(dueInDays: number): DeadlineRisk {
  if (dueInDays <= 2) return "high";
  if (dueInDays <= 5) return "medium";
  return "low";
}

function percent(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}
