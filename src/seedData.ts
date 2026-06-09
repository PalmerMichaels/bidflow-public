import type { BidResponse } from "./bidflow.js";

export const syntheticBid: BidResponse = {
  id: "bf-demo-001",
  name: "Harbor Lantern Response Pack",
  fictionalBuyer: "Northstar Civic Labs",
  responseLead: "Mira Patel",
  evidence: [
    { id: "ev-security-summary", title: "Synthetic security controls summary", status: "approved" },
    { id: "ev-delivery-plan", title: "Fictional 45-day delivery plan", status: "draft" },
    { id: "ev-support-roster", title: "Demo support coverage roster", status: "approved" },
    { id: "ev-pricing-note", title: "Illustrative pricing assumption note", status: "missing" },
    { id: "ev-accessibility", title: "Synthetic accessibility checklist", status: "approved" }
  ],
  requirements: [
    {
      id: "req-001",
      label: "Attach current security controls narrative",
      category: "security",
      priority: "critical",
      owner: "Jon Bell",
      evidenceIds: ["ev-security-summary"],
      dueInDays: 7
    },
    {
      id: "req-002",
      label: "Confirm implementation timeline and milestones",
      category: "delivery",
      priority: "critical",
      owner: "Mira Patel",
      evidenceIds: ["ev-delivery-plan"],
      dueInDays: 3
    },
    {
      id: "req-003",
      label: "Identify named support escalation owner",
      category: "support",
      priority: "standard",
      owner: "Theo Nguyen",
      evidenceIds: ["ev-support-roster"],
      dueInDays: 6
    },
    {
      id: "req-004",
      label: "Review commercial assumptions for response appendix",
      category: "commercial",
      priority: "standard",
      evidenceIds: ["ev-pricing-note"],
      dueInDays: 1
    },
    {
      id: "req-005",
      label: "Include accessibility posture note if space permits",
      category: "delivery",
      priority: "optional",
      owner: "Iris Chen",
      evidenceIds: ["ev-accessibility"],
      dueInDays: 10
    }
  ]
};
