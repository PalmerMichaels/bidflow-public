# Bidflow

Bidflow is an original clean-room TypeScript CLI that checks a synthetic bid response flow for readiness. It tracks fictional requirements, owner coverage, compliance evidence, and deadline risk, then prints a simple local report.

## Disclaimers

- This is a clean-room public demo with no affiliation to any real company, accelerator, or YC.
- All data is synthetic and fictional.
- This is not legal, procurement, compliance, or financial advice.
- Do not use this tool for regulated decisions, real procurement submissions, pricing decisions, contract review, or compliance determinations.
- No credentials, scraped data, or external services are required.

## Run

```bash
npm install
npm start
```

## Validate

```bash
npm test
npm run build
```

## What It Checks

- Owner coverage for each fictional requirement.
- Approved versus missing evidence for local synthetic evidence records.
- Deadline pressure from deterministic due-date offsets.
- A readiness score and status for demo triage only.

## Project Structure

- `src/index.ts` renders the CLI report and disclaimer.
- `src/bidflow.ts` contains readiness scoring and seed validation logic.
- `src/seedData.ts` contains fictional local seed data.
- `test/validation.test.ts` asserts deterministic validation behavior.
