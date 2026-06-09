# Bidflow

Bidflow is an original, dependency-light TypeScript CLI that demonstrates a clean-room electrical takeoff workflow. It ingests synthetic plan packages, extracts invented electrical line items, marks low-confidence review items, builds bid package dashboards, compares estimates, records exceptions, and emits mocked integration events.

## Requirements

- Node.js 20 or newer.
- No runtime dependencies are required.

## Usage

Run the CLI with today's date:

```bash
npm start
```

Run with a fixed date for deterministic output:

```bash
npm start -- --today=2026-06-09
```

## Validation

Run unit tests:

```bash
npm test
```

Run seed-data and board validation:

```bash
npm run validate
```

## What It Demonstrates

- Synthetic plan/package intake for fictional electrical bid packages.
- Deterministic AI-style line-item extraction and review routing.
- Bid package dashboards with material subtotals, labor hours, readiness, and estimator ownership.
- Estimate comparisons against fictional baselines.
- Exception handling for low-confidence, scope-gap, variance, and held-export states.
- Mocked integrations for a planroom inbox, estimating CSV export, and dashboard API.

## Synthetic Data Statement

All plan packages, sheet names, callouts, quantities, confidence scores, costs, labor hours, estimates, exceptions, estimator names, and integration events in this repository are synthetic seed data created for demonstration and local validation only.

## Clean-Room Disclaimer

This public implementation is original clean-room code. It does not use proprietary materials, private product behavior, confidential datasets, or copied implementation details from any third party.

## Non-Regulated Disclaimer

This tool is a lightweight takeoff workflow demo. It is not a regulated procurement, engineering, electrical design, estimating, financial, compliance, legal, or production bidding system. Users are responsible for independent professional review before making business decisions.

## No-Affiliation Statement

This repository does not claim affiliation with, endorsement by, or sponsorship from any company, accelerator, government agency, buyer, vendor, or named organization.
