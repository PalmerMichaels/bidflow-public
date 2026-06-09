import type { EstimateCatalog, PlanPackage } from "./takeoff.js";

export const syntheticPlanPackages: PlanPackage[] = [
  {
    id: "PKG-E-410",
    name: "Juniper Lab Tenant Fit-Out",
    dueDate: "2026-06-18",
    estimator: "Avery Stone",
    sheets: [
      {
        id: "E1.01",
        title: "Lighting and Controls",
        area: "Open lab",
        callouts: [
          { code: "L2", description: "linear LED fixture", quantity: 42, confidence: 0.94 },
          { code: "OS", description: "ceiling occupancy sensor", quantity: 16, confidence: 0.9 },
          { code: "PANEL-LA", description: "208Y/120V lighting panel", quantity: 1, confidence: 0.88 }
        ]
      },
      {
        id: "E2.04",
        title: "Power Plan",
        area: "Lab benches",
        callouts: [
          { code: "R20", description: "20A duplex receptacle", quantity: 86, confidence: 0.92 },
          { code: "DROP", description: "overhead cord reel drop", quantity: 18, confidence: 0.79 },
          { code: "EM", description: "emergency power connection", quantity: 6, confidence: 0.76 }
        ]
      }
    ]
  },
  {
    id: "PKG-E-422",
    name: "Riverbend Market Renovation",
    dueDate: "2026-06-21",
    estimator: "Mika Chen",
    sheets: [
      {
        id: "E0.02",
        title: "Fixture Schedule",
        area: "Sales floor",
        callouts: [
          { code: "TRK", description: "track lighting head", quantity: 124, confidence: 0.91 },
          { code: "EXIT", description: "exit sign with battery", quantity: 14, confidence: 0.96 },
          { code: "UNKNOWN-FEED", description: "unlabeled refrigerated case feed", quantity: 9, confidence: 0.61 }
        ]
      },
      {
        id: "E3.01",
        title: "One-Line Diagram",
        area: "Service room",
        callouts: [
          { code: "XFMR-45", description: "45 kVA dry-type transformer", quantity: 2, confidence: 0.87 },
          { code: "SWBD", description: "800A distribution switchboard", quantity: 1, confidence: 0.84 }
        ]
      }
    ]
  },
  {
    id: "PKG-E-437",
    name: "Cedar Hall Classroom Refresh",
    dueDate: "2026-06-28",
    estimator: "Noor Patel",
    sheets: [
      {
        id: "E1.10",
        title: "Classroom Lighting",
        area: "Level two classrooms",
        callouts: [
          { code: "L1", description: "recessed LED troffer", quantity: 72, confidence: 0.95 },
          { code: "DIM", description: "wallbox dimmer station", quantity: 18, confidence: 0.93 }
        ]
      },
      {
        id: "E2.12",
        title: "Low Voltage Rough-In",
        area: "Teaching walls",
        callouts: [
          { code: "AV", description: "AV floor box rough-in", quantity: 18, confidence: 0.89 },
          { code: "DATA", description: "dual data outlet rough-in", quantity: 54, confidence: 0.91 }
        ]
      }
    ]
  }
];

export const syntheticEstimateCatalog: EstimateCatalog = {
  itemCosts: {
    L2: { material: 185, laborHours: 0.85 },
    OS: { material: 72, laborHours: 0.45 },
    "PANEL-LA": { material: 2450, laborHours: 6.5 },
    R20: { material: 18, laborHours: 0.28 },
    DROP: { material: 165, laborHours: 1.1 },
    EM: { material: 220, laborHours: 1.25 },
    TRK: { material: 64, laborHours: 0.38 },
    EXIT: { material: 118, laborHours: 0.42 },
    "UNKNOWN-FEED": { material: 310, laborHours: 1.4 },
    "XFMR-45": { material: 3850, laborHours: 8.75 },
    SWBD: { material: 24600, laborHours: 32 },
    L1: { material: 142, laborHours: 0.62 },
    DIM: { material: 88, laborHours: 0.4 },
    AV: { material: 210, laborHours: 1.55 },
    DATA: { material: 52, laborHours: 0.5 }
  },
  baselineEstimates: {
    "PKG-E-410": { material: 22000, laborHours: 178 },
    "PKG-E-422": { material: 52000, laborHours: 154 },
    "PKG-E-437": { material: 24500, laborHours: 119 }
  }
};
