import assert from "node:assert/strict";
import test from "node:test";
import { syntheticBids } from "../src/bids.ts";
import { daysUntilDue, prioritizeBids, scoreBid } from "../src/scoring.ts";

const fixedToday = new Date("2026-06-09T00:00:00Z");

test("daysUntilDue counts whole UTC days", () => {
  assert.equal(daysUntilDue("2026-06-12", fixedToday), 3);
});

test("priority scores are deterministic and sorted descending", () => {
  const board = prioritizeBids(syntheticBids, fixedToday);
  assert.equal(board[0].id, "BID-1003");

  for (let index = 1; index < board.length; index += 1) {
    assert.ok(board[index - 1].priorityScore >= board[index].priorityScore);
  }
});

test("submitted bids receive lower active-work priority", () => {
  const submitted = syntheticBids.find((bid) => bid.stage === "submitted");
  assert.ok(submitted);
  const activeScore = scoreBid({ ...submitted, stage: "review" }, fixedToday);
  const submittedScore = scoreBid(submitted, fixedToday);
  assert.ok(activeScore > submittedScore);
});
