import { getScenarioServerOnly } from "./scenario-loader";
import { evaluateFactDisclosure } from "./disclosure-engine";
import { evaluateEvidenceUnlocks } from "./evidence-engine";
import { canTransitionStage, STAGE_FLOW, ROLE_STAGE_MAPPING } from "./stage-machine";
import type { 
  SimulationStage, 
  CharacterRole, 
  SimulationSessionState,
  EvidenceItem,
  ScenarioFact 
} from "@/types";

export interface ScenarioTurnResult {
  session: SimulationSessionState;
  newlyUnlockedFactIds: string[];
  newlyUnlockedEvidenceIds: string[];
  newlyUnlockedEvidence: EvidenceItem[];
  authorizedFactsForRole: ScenarioFact[];
}

/**
 * ScenarioEngine: The deterministic, authoritative factual coordinator.
 * 
 * Rules:
 * - Controls factual truth deterministically.
 * - Enforces character authorization boundaries.
 * - Computes evidence unlocks.
 * - Protects hidden facts from client exposure.
 */
export class ScenarioEngine {
  /**
   * Process a student message turn deterministically.
   */
  static processTurn(
    session: SimulationSessionState,
    detectedTopic?: string
  ): ScenarioTurnResult {
    const scenario = getScenarioServerOnly(session.scenarioId);
    if (!scenario) {
      throw new Error(`Scenario not found: ${session.scenarioId}`);
    }

    const role = session.currentCharacterRole;

    // 1. Evaluate fact disclosure
    const factResult = evaluateFactDisclosure(
      scenario,
      role,
      detectedTopic,
      session.unlockedFactIds
    );

    const updatedFactIds = Array.from(
      new Set([...session.unlockedFactIds, ...factResult.newlyUnlockedFactIds])
    );

    // 2. Evaluate evidence unlocks
    const evidenceResult = evaluateEvidenceUnlocks(
      scenario,
      role,
      detectedTopic,
      updatedFactIds,
      session.unlockedEvidenceIds,
      session.currentStage
    );

    const updatedEvidenceIds = Array.from(
      new Set([...session.unlockedEvidenceIds, ...evidenceResult.newlyUnlockedEvidenceIds])
    );

    const updatedSession: SimulationSessionState = {
      ...session,
      unlockedFactIds: updatedFactIds,
      unlockedEvidenceIds: updatedEvidenceIds,
      lastActivityAt: new Date().toISOString(),
    };

    const newlyUnlockedEvidenceObjects = scenario.evidence.filter((e) =>
      evidenceResult.newlyUnlockedEvidenceIds.includes(e.id)
    );

    return {
      session: updatedSession,
      newlyUnlockedFactIds: factResult.newlyUnlockedFactIds,
      newlyUnlockedEvidenceIds: evidenceResult.newlyUnlockedEvidenceIds,
      newlyUnlockedEvidence: newlyUnlockedEvidenceObjects,
      authorizedFactsForRole: factResult.authorizedFactsForRole,
    };
  }

  /**
   * Switches the active character and updates stage if appropriate
   */
  static switchCharacter(
    session: SimulationSessionState,
    newRole: CharacterRole
  ): SimulationSessionState {
    const targetStage = ROLE_STAGE_MAPPING[newRole];
    const canTransition = canTransitionStage(session.currentStage, targetStage);

    return {
      ...session,
      currentCharacterRole: newRole,
      currentStage: canTransition ? targetStage : session.currentStage,
      lastActivityAt: new Date().toISOString(),
    };
  }

  /**
   * Updates the simulation stage with validation
   */
  static transitionStage(
    session: SimulationSessionState,
    targetStage: SimulationStage,
    hasSubmittedAnalysis: boolean = false
  ): SimulationSessionState {
    if (!canTransitionStage(session.currentStage, targetStage, hasSubmittedAnalysis)) {
      throw new Error(
        `Bosqichni o'zgartirish ruxsat etilmagan: ${session.currentStage} -> ${targetStage}`
      );
    }

    const scenario = getScenarioServerOnly(session.scenarioId);
    let updatedEvidenceIds = [...session.unlockedEvidenceIds];

    // Trigger auto-stage unlocks if any
    if (scenario) {
      const autoUnlock = evaluateEvidenceUnlocks(
        scenario,
        session.currentCharacterRole,
        undefined,
        session.unlockedFactIds,
        session.unlockedEvidenceIds,
        targetStage
      );
      updatedEvidenceIds = Array.from(
        new Set([...updatedEvidenceIds, ...autoUnlock.newlyUnlockedEvidenceIds])
      );
    }

    return {
      ...session,
      currentStage: targetStage,
      unlockedEvidenceIds: updatedEvidenceIds,
      status: targetStage === "completed" ? "completed" : session.status,
      completedAt: targetStage === "completed" ? new Date().toISOString() : session.completedAt,
      lastActivityAt: new Date().toISOString(),
    };
  }
}
