import assert from "node:assert/strict";
import test from "node:test";
import {
  allSteps,
  canCloseG7,
  canTransition,
  completenessForStep,
  deliveryGroups,
  downstreamStepsToReopen,
  gateways,
  matrixCells,
  processSteps,
  uxSteps,
  validateGatewayModel,
} from "../app/data/gateways.ts";

test("blueprint coverage is exact and fully linked", () => {
  const result = validateGatewayModel();
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.counts, { gateways:7, groups:12, cells:84, gatewaySteps:77, uxSteps:12, totalSteps:89 });
  assert.equal(new Set(allSteps.map((step) => step.id)).size, 89);
});

test("every matrix cell has the mandatory relationship record", () => {
  assert.equal(matrixCells.length, gateways.length * deliveryGroups.length);
  for (const cell of matrixCells) {
    assert.ok(cell.stepIds.length > 0, cell.id);
    assert.ok(cell.inputIds.length > 0, cell.id);
    assert.ok(cell.outputIds.length > 0, cell.id);
    assert.ok(cell.evidenceIds.length > 0, cell.id);
    assert.ok(cell.responsibleRole && cell.accountableRole, cell.id);
  }
});

test("every controlled step carries all confirmation and audit fields", () => {
  for (const step of allSteps) {
    assert.ok(step.groupIds.length > 0, step.id);
    assert.ok(step.responsibleOwner && step.accountableOwner && step.reviewer, step.id);
    assert.ok(step.inputIds.length && step.outputIds.length && step.evidenceIds.length, step.id);
    assert.ok(step.confirmation.prepare && step.confirmation.review && step.confirmation.accept, step.id);
    assert.ok(step.version > 0 && step.auditHistory.length > 0, step.id);
  }
});

test("an invalid transition remains locked", () => {
  const step = structuredClone(processSteps[1]);
  step.confirmation.prepare.by = "Same person";
  step.confirmation.accept.by = "Same person";
  step.confirmation.accept.decision = "Accepted";
  const result = canTransition(step, new Set(step.inputIds));
  assert.equal(result.allowed, false);
  assert.equal(result.separated, false);
});

test("a missing or superseded input blocks transition", () => {
  const step = structuredClone(processSteps[1]);
  step.confirmation.prepare.by = "Preparer";
  step.confirmation.accept.by = "Approver";
  step.confirmation.accept.decision = "Accepted";
  assert.equal(canTransition(step, new Set()).allowed, false);
  assert.equal(canTransition(step, new Set(step.inputIds)).allowed, true);
});

test("a critical condition cannot be bypassed conditionally", () => {
  const step = structuredClone(processSteps[1]);
  step.confirmation.prepare.by = "Preparer";
  step.confirmation.accept.by = "Approver";
  step.confirmation.accept.decision = "Conditional";
  step.conditions = ["Authority life-safety acceptance outstanding"];
  const result = canTransition(step, new Set(step.inputIds));
  assert.equal(result.allowed, false);
  assert.equal(result.criticalCondition, true);
});

test("material source change identifies downstream steps to reopen", () => {
  const reopened = downstreamStepsToReopen("G1-S01");
  assert.ok(reopened.includes("G1-S02"));
  assert.ok(reopened.includes("G7-S11"));
  assert.equal(reopened.includes("G1-S01"), false);
});

test("completeness cannot reach 100 with confirmation gaps", () => {
  for (const step of processSteps) assert.ok(completenessForStep(step) < 100, step.id);
});

test("G7 cannot close until all UX steps and critical issues are cleared", () => {
  assert.equal(canCloseG7().allowed, false);
  const confirmed = uxSteps.map((source) => {
    const step = structuredClone(source);
    step.confirmation.prepare.by = "UX preparer";
    step.confirmation.review.by = "Assurance reviewer";
    step.confirmation.accept.by = "Asset owner";
    step.confirmation.accept.decision = "Accepted";
    return step;
  });
  assert.equal(canCloseG7(confirmed, 1).allowed, false);
  assert.equal(canCloseG7(confirmed, 0).allowed, true);
});
