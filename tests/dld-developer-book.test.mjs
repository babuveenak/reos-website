import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const book = JSON.parse(await readFile(new URL("../app/data/dldDeveloperBook.json", import.meta.url), "utf8"));
const { preDevelopment, development, postDevelopment } = book.stages;

test("preserves the three DLD Developer Book phases without replacing REOS stages", () => {
  assert.deepEqual([preDevelopment.id, development.id, postDevelopment.id], ["pre-development", "development", "post-development"]);
  assert.equal(preDevelopment.services.length, 6);
  assert.equal(development.subphases.length, 3);
  assert.equal(postDevelopment.services.length, 2);
});

test("keeps the official pre-development sequence and post-development closure records", () => {
  assert.deepEqual(preDevelopment.services.map(({ title }) => title), [
    "Submission Of The Initial Approval Certificate",
    "Trade Name Reservation",
    "Issuing Trade License Request",
    "Dld Approval For The Trade License (noc)",
    "Registering The Developer In Real Estate Developers’ Log",
    "Registration In Oqood System Course",
  ]);
  assert.deepEqual(postDevelopment.services.map(({ title }) => title), [
    "Settlement Of The Escrow Account",
    "Project Units Loading - Final Loading",
  ]);
});

test("preserves all six authority branches and every published development record", () => {
  const expectedAuthorities = [
    "Dubai Municipality",
    "Dubai Development Authority",
    "Dubai Maritime City Authority",
    "Dubai Integrated Economic zone – DIEZ",
    "Trakhees",
    "Dubai South",
  ].sort();
  for (const subphase of development.subphases) {
    assert.equal(subphase.branches.length, 6, subphase.label);
    assert.deepEqual(subphase.branches.map(({ authority }) => authority).sort(), expectedAuthorities, subphase.label);
    assert.ok(subphase.branches.every(({ sourceUrl }) => sourceUrl.startsWith("https://dubailand.gov.ae/en/")), `${subphase.label} must use English DLD sources`);
  }
  const records = development.subphases.flatMap(({ branches }) => branches.flatMap(({ services }) => services));
  assert.equal(records.length, 162);
  assert.ok(records.every(({ id, title, description, channel }) => id && title && description && channel), "every DLD record needs an identity, description and channel");
});

test("places project registration and escrow opening in the off-plan development sub-phase", () => {
  const escrowTitle = "Request For Registration Of A Real Estate Project And Opening Of An Escrow Account";
  assert.equal(preDevelopment.services.some(({ title }) => title === escrowTitle), false, "escrow opening must not be presented as pre-development");
  const offPlan = development.subphases.find(({ id }) => id === "sales-stage-during-project-completion-off-plan-property-sale");
  assert.ok(offPlan);
  for (const branch of offPlan.branches) assert.equal(branch.services.some(({ title }) => title === escrowTitle), true, branch.authority);
});
