# Bidflow

Bidflow is an original, dependency-light TypeScript CLI that prioritizes a small synthetic bid pipeline. It scores invented opportunities by urgency, value, margin, fit, relationship strength, workload, stage, and risk, then prints a next-action board.

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

## Synthetic Data Statement

All buyers, bid titles, values, dates, margins, workload estimates, scores, and actions in this repository are synthetic seed data created for demonstration and local validation only.

## Clean-Room Disclaimer

This public implementation is original clean-room code. It does not use proprietary materials, private product behavior, confidential datasets, or copied implementation details from any third party.

## Non-Regulated Disclaimer

This tool is a lightweight prioritization demo. It is not a regulated procurement, financial, compliance, legal, or production bidding system. Users are responsible for independent review before making business decisions.

## No-Affiliation Statement

This repository does not claim affiliation with, endorsement by, or sponsorship from any company, accelerator, government agency, buyer, vendor, or named organization.
