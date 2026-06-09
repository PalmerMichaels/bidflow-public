export type PlanCallout = {
  code: string;
  description: string;
  quantity: number;
  confidence: number;
};

export type PlanSheet = {
  id: string;
  title: string;
  area: string;
  callouts: PlanCallout[];
};

export type PlanPackage = {
  id: string;
  name: string;
  dueDate: string;
  estimator: string;
  sheets: PlanSheet[];
};

export type CostEntry = {
  material: number;
  laborHours: number;
};

export type EstimateCatalog = {
  itemCosts: Record<string, CostEntry>;
  baselineEstimates: Record<string, CostEntry>;
};

export type ExtractedLineItem = {
  id: string;
  packageId: string;
  sheetId: string;
  area: string;
  code: string;
  description: string;
  quantity: number;
  unit: "each";
  confidence: number;
  reviewStatus: "accepted" | "needs-review";
  materialTotal: number;
  laborHours: number;
};

export type ReviewFinding = {
  itemId: string;
  severity: "info" | "warning" | "blocker";
  message: string;
};

export type BidPackageDashboard = {
  packageId: string;
  name: string;
  dueDate: string;
  estimator: string;
  lineItemCount: number;
  needsReviewCount: number;
  materialSubtotal: number;
  laborHours: number;
  readiness: "ready" | "review" | "blocked";
};

export type EstimateComparison = {
  packageId: string;
  takeoffMaterial: number;
  baselineMaterial: number;
  materialDeltaPercent: number;
  takeoffLaborHours: number;
  baselineLaborHours: number;
  laborDeltaPercent: number;
};

export type ExceptionRecord = {
  packageId: string;
  category: "low-confidence" | "scope-gap" | "estimate-variance" | "integration";
  severity: "warning" | "blocker";
  detail: string;
};

export type MockIntegrationEvent = {
  target: "planroom-inbox" | "estimating-csv" | "bid-dashboard-api";
  status: "queued" | "sent" | "held";
  detail: string;
};

export type TakeoffWorkspace = {
  generatedFor: string;
  lineItems: ExtractedLineItem[];
  findings: ReviewFinding[];
  dashboards: BidPackageDashboard[];
  comparisons: EstimateComparison[];
  exceptions: ExceptionRecord[];
  integrations: MockIntegrationEvent[];
};

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function percentageDelta(actual: number, baseline: number): number {
  if (baseline === 0) return 0;
  return round(((actual - baseline) / baseline) * 100);
}

export function extractLineItems(packages: PlanPackage[], catalog: EstimateCatalog): ExtractedLineItem[] {
  return packages.flatMap((planPackage) =>
    planPackage.sheets.flatMap((sheet) =>
      sheet.callouts.map((callout, index) => {
        const cost = catalog.itemCosts[callout.code] ?? { material: 0, laborHours: 0 };
        const reviewStatus = callout.confidence < 0.82 || callout.code.includes("UNKNOWN") ? "needs-review" : "accepted";

        return {
          id: `${planPackage.id}-${sheet.id}-${index + 1}`,
          packageId: planPackage.id,
          sheetId: sheet.id,
          area: sheet.area,
          code: callout.code,
          description: callout.description,
          quantity: callout.quantity,
          unit: "each",
          confidence: callout.confidence,
          reviewStatus,
          materialTotal: round(callout.quantity * cost.material),
          laborHours: round(callout.quantity * cost.laborHours)
        } satisfies ExtractedLineItem;
      })
    )
  );
}

export function reviewLineItems(items: ExtractedLineItem[]): ReviewFinding[] {
  return items.flatMap((item) => {
    const findings: ReviewFinding[] = [];

    if (item.confidence < 0.82) {
      findings.push({
        itemId: item.id,
        severity: item.confidence < 0.7 ? "blocker" : "warning",
        message: `Reviewer should verify ${item.code} on ${item.sheetId}; extraction confidence is ${Math.round(item.confidence * 100)}%.`
      });
    }

    if (item.code.includes("UNKNOWN")) {
      findings.push({
        itemId: item.id,
        severity: "blocker",
        message: `Unlabeled electrical scope requires estimator classification before bid export.`
      });
    }

    if (item.quantity >= 100 && item.confidence < 0.93) {
      findings.push({
        itemId: item.id,
        severity: "warning",
        message: `High-quantity item should receive a second count pass before package review.`
      });
    }

    return findings;
  });
}

export function buildDashboards(packages: PlanPackage[], items: ExtractedLineItem[], findings: ReviewFinding[]): BidPackageDashboard[] {
  return packages.map((planPackage) => {
    const packageItems = items.filter((item) => item.packageId === planPackage.id);
    const findingItemIds = new Set(findings.filter((finding) => packageItems.some((item) => item.id === finding.itemId)).map((finding) => finding.itemId));
    const hasBlocker = findings.some((finding) => finding.severity === "blocker" && packageItems.some((item) => item.id === finding.itemId));
    const needsReviewCount = packageItems.filter((item) => item.reviewStatus === "needs-review" || findingItemIds.has(item.id)).length;

    return {
      packageId: planPackage.id,
      name: planPackage.name,
      dueDate: planPackage.dueDate,
      estimator: planPackage.estimator,
      lineItemCount: packageItems.length,
      needsReviewCount,
      materialSubtotal: round(packageItems.reduce((sum, item) => sum + item.materialTotal, 0)),
      laborHours: round(packageItems.reduce((sum, item) => sum + item.laborHours, 0)),
      readiness: hasBlocker ? "blocked" : needsReviewCount > 0 ? "review" : "ready"
    };
  });
}

export function compareEstimates(dashboards: BidPackageDashboard[], catalog: EstimateCatalog): EstimateComparison[] {
  return dashboards.map((dashboard) => {
    const baseline = catalog.baselineEstimates[dashboard.packageId] ?? { material: 0, laborHours: 0 };

    return {
      packageId: dashboard.packageId,
      takeoffMaterial: dashboard.materialSubtotal,
      baselineMaterial: baseline.material,
      materialDeltaPercent: percentageDelta(dashboard.materialSubtotal, baseline.material),
      takeoffLaborHours: dashboard.laborHours,
      baselineLaborHours: baseline.laborHours,
      laborDeltaPercent: percentageDelta(dashboard.laborHours, baseline.laborHours)
    };
  });
}

export function buildExceptions(
  dashboards: BidPackageDashboard[],
  findings: ReviewFinding[],
  comparisons: EstimateComparison[]
): ExceptionRecord[] {
  const packageExceptions = dashboards.flatMap((dashboard) => {
    const records: ExceptionRecord[] = [];

    if (dashboard.needsReviewCount > 0) {
      records.push({
        packageId: dashboard.packageId,
        category: dashboard.readiness === "blocked" ? "scope-gap" : "low-confidence",
        severity: dashboard.readiness === "blocked" ? "blocker" : "warning",
        detail: `${dashboard.needsReviewCount} extracted line item(s) need estimator review.`
      });
    }

    const comparison = comparisons.find((entry) => entry.packageId === dashboard.packageId);
    if (comparison && (Math.abs(comparison.materialDeltaPercent) >= 25 || Math.abs(comparison.laborDeltaPercent) >= 25)) {
      records.push({
        packageId: dashboard.packageId,
        category: "estimate-variance",
        severity: "warning",
        detail: `Takeoff differs from baseline by ${comparison.materialDeltaPercent}% material and ${comparison.laborDeltaPercent}% labor.`
      });
    }

    return records;
  });

  const blockerCount = findings.filter((finding) => finding.severity === "blocker").length;
  if (blockerCount > 0) {
    packageExceptions.push({
      packageId: "workspace",
      category: "integration",
      severity: "warning",
      detail: `${blockerCount} blocker finding(s) keep the mocked estimating export in held status.`
    });
  }

  return packageExceptions;
}

export function buildMockIntegrations(exceptions: ExceptionRecord[]): MockIntegrationEvent[] {
  const hasBlocker = exceptions.some((exception) => exception.severity === "blocker");

  return [
    { target: "planroom-inbox", status: "sent", detail: "Accepted synthetic plan-package intake manifest." },
    {
      target: "estimating-csv",
      status: hasBlocker ? "held" : "queued",
      detail: hasBlocker ? "Held until scope-gap exceptions are cleared." : "Queued synthetic line-item export."
    },
    { target: "bid-dashboard-api", status: "sent", detail: "Published synthetic dashboard summary to local mock endpoint." }
  ];
}

export function buildTakeoffWorkspace(
  packages: PlanPackage[],
  catalog: EstimateCatalog,
  generatedFor = "2026-06-09"
): TakeoffWorkspace {
  const lineItems = extractLineItems(packages, catalog);
  const findings = reviewLineItems(lineItems);
  const dashboards = buildDashboards(packages, lineItems, findings);
  const comparisons = compareEstimates(dashboards, catalog);
  const exceptions = buildExceptions(dashboards, findings, comparisons);
  const integrations = buildMockIntegrations(exceptions);

  return { generatedFor, lineItems, findings, dashboards, comparisons, exceptions, integrations };
}

export function renderWorkspace(workspace: TakeoffWorkspace): string {
  const dashboardRows = workspace.dashboards.map(
    (dashboard) =>
      `${dashboard.packageId} | ${dashboard.readiness.toUpperCase()} | ${dashboard.lineItemCount} items | ${dashboard.needsReviewCount} review | $${dashboard.materialSubtotal.toLocaleString()} material | ${dashboard.laborHours} labor hrs`
  );
  const exceptionRows = workspace.exceptions.map(
    (exception) => `${exception.severity.toUpperCase()} ${exception.category} ${exception.packageId}: ${exception.detail}`
  );
  const integrationRows = workspace.integrations.map(
    (event) => `${event.target}: ${event.status} - ${event.detail}`
  );

  return [
    "Bidflow synthetic electrical takeoff workspace",
    "Clean-room public demo with fictional plan packages, line items, estimates, and mocked integrations only.",
    `Generated for: ${workspace.generatedFor}`,
    `Extracted line items: ${workspace.lineItems.length}`,
    `Review findings: ${workspace.findings.length}`,
    "",
    "Bid package dashboards",
    ...dashboardRows,
    "",
    "Exceptions",
    ...(exceptionRows.length > 0 ? exceptionRows : ["No exceptions"]),
    "",
    "Mocked integrations",
    ...integrationRows
  ].join("\n");
}
