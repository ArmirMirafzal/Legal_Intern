import { describe, it, expect } from "vitest";
import { getScenarioServerOnly, getSanitizedScenarioPublic } from "../../src/lib/scenario/scenario-loader";
import { evaluateFactDisclosure } from "../../src/lib/scenario/disclosure-engine";
import { evaluateEvidenceUnlocks } from "../../src/lib/scenario/evidence-engine";
import { canTransitionStage, getNextStage } from "../../src/lib/scenario/stage-machine";
import { ScenarioEngine } from "../../src/lib/scenario/scenario-engine";
import type { SimulationSessionState } from "../../src/types";

describe("Scenario Engine & Security Boundary", () => {
  it("should never expose hidden facts in the public scenario brief", () => {
    const publicData = getSanitizedScenarioPublic("CASE-001");
    expect(publicData).not.toBeNull();
    // Facts array must NOT exist on public brief
    expect((publicData as any).facts).toBeUndefined();
    expect((publicData as any).evidence).toBeUndefined();
  });

  it("should load server-only scenario with complete facts and evidence", () => {
    const serverScenario = getScenarioServerOnly("CASE-001");
    expect(serverScenario).not.toBeNull();
    expect(serverScenario!.facts.length).toBeGreaterThanOrEqual(10);
    expect(serverScenario!.evidence.length).toBeGreaterThanOrEqual(5);
  });

  it("applicant role should not disclose respondent-exclusive facts", () => {
    const scenario = getScenarioServerOnly("CASE-001")!;
    // FACT-005 is authorized for respondent only
    const result = evaluateFactDisclosure(scenario, "applicant", "payment_history", []);
    expect(result.newlyUnlockedFactIds).not.toContain("FACT-005");
  });

  it("should unlock FACT-003 and EVD-001 when applicant discusses payment_history", () => {
    const scenario = getScenarioServerOnly("CASE-001")!;
    const disclosure = evaluateFactDisclosure(
      scenario,
      "applicant",
      "payment_history",
      ["FACT-001", "FACT-002"]
    );
    expect(disclosure.newlyUnlockedFactIds).toContain("FACT-003");

    const evidenceUnlock = evaluateEvidenceUnlocks(
      scenario,
      "applicant",
      "payment_history",
      ["FACT-001", "FACT-002", "FACT-003"],
      [],
      "applicant_interview"
    );
    expect(evidenceUnlock.newlyUnlockedEvidenceIds).toContain("EVD-001");
  });

  it("should not unlock evidence twice", () => {
    const scenario = getScenarioServerOnly("CASE-001")!;
    const evidenceUnlock = evaluateEvidenceUnlocks(
      scenario,
      "applicant",
      "payment_history",
      ["FACT-001", "FACT-002", "FACT-003"],
      ["EVD-001"], // Already unlocked
      "applicant_interview"
    );
    expect(evidenceUnlock.newlyUnlockedEvidenceIds).not.toContain("EVD-001");
  });

  it("should validate allowed stage transitions", () => {
    expect(canTransitionStage("briefing", "applicant_interview")).toBe(true);
    expect(canTransitionStage("applicant_interview", "respondent_interview")).toBe(true);
    expect(canTransitionStage("applicant_interview", "witness_interview")).toBe(true);
    // Cannot skip straight to completed without submitting analysis
    expect(canTransitionStage("briefing", "completed")).toBe(false);
  });
});
