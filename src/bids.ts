export type BidStage = "new" | "research" | "drafting" | "review" | "submitted";

export type Bid = {
  id: string;
  buyer: string;
  title: string;
  stage: BidStage;
  dueDate: string;
  estimatedValue: number;
  marginPercent: number;
  workloadHours: number;
  fitScore: number;
  relationshipScore: number;
  riskScore: number;
};

export const syntheticBids: Bid[] = [
  {
    id: "BID-1001",
    buyer: "Northstar Transit Lab",
    title: "Passenger Feedback Kiosk Pilot",
    stage: "drafting",
    dueDate: "2026-06-16",
    estimatedValue: 86000,
    marginPercent: 31,
    workloadHours: 46,
    fitScore: 89,
    relationshipScore: 73,
    riskScore: 24
  },
  {
    id: "BID-1002",
    buyer: "Harborview Parks Cooperative",
    title: "Trail Maintenance Scheduling Portal",
    stage: "research",
    dueDate: "2026-06-24",
    estimatedValue: 52000,
    marginPercent: 26,
    workloadHours: 38,
    fitScore: 78,
    relationshipScore: 68,
    riskScore: 18
  },
  {
    id: "BID-1003",
    buyer: "Cedar Ridge Library Network",
    title: "Community Room Reservation Upgrade",
    stage: "review",
    dueDate: "2026-06-12",
    estimatedValue: 41000,
    marginPercent: 34,
    workloadHours: 22,
    fitScore: 84,
    relationshipScore: 82,
    riskScore: 16
  },
  {
    id: "BID-1004",
    buyer: "Prairie Makers Guild",
    title: "Inventory Forecast Dashboard",
    stage: "new",
    dueDate: "2026-07-03",
    estimatedValue: 99000,
    marginPercent: 19,
    workloadHours: 74,
    fitScore: 61,
    relationshipScore: 40,
    riskScore: 52
  },
  {
    id: "BID-1005",
    buyer: "Lakeside Food Hub",
    title: "Vendor Intake Workflow",
    stage: "submitted",
    dueDate: "2026-06-20",
    estimatedValue: 63000,
    marginPercent: 29,
    workloadHours: 12,
    fitScore: 76,
    relationshipScore: 71,
    riskScore: 22
  }
];
