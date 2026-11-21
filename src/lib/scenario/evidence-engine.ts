import type { ScenarioData, CharacterRole, SimulationStage, EvidenceItem } from "@/types";

export interface EvidenceUnlockResult {
  newlyUnlockedEvidenceIds: string[];
  allUnlockedEvidence: EvidenceItem[];
}

/**
 * Evaluates whether any synthetic evidence items should be unlocked based on:
 * 1. Newly disclosed fact IDs
 * 2. Interaction topic and character role
 * 3. Current simulation stage (e.g. stage-triggered exhibits)
 */
export function evaluateEvidenceUnlocks(
  scenario: ScenarioData,
  role: CharacterRole,
  topic: string | undefined,
  currentUnlockedFactIds: string[],
  currentUnlockedEvidenceIds: string[],
  stage: SimulationStage
): EvidenceUnlockResult {
  const unlockedFactSet = new Set(currentUnlockedFactIds);
  const unlockedEvidenceSet = new Set(currentUnlockedEvidenceIds);
  const newlyUnlocked: string[] = [];

  for (const item of scenario.evidence) {
    if (unlockedEvidenceSet.has(item.id)) continue;

    const condition = item.unlockCondition;
    let shouldUnlock = false;

    // Check 1: Auto unlock at stage
    if (condition.autoUnlockAtStage && condition.autoUnlockAtStage === stage) {
      shouldUnlock = true;
    }

    // Check 2: Required fact unlocked
    if (condition.requiredFactId && unlockedFactSet.has(condition.requiredFactId)) {
      shouldUnlock = true;
    }

    // Check 3: Topic and role match
    if (
      condition.requiredTopic &&
      topic &&
      condition.requiredTopic.toLowerCase() === topic.toLowerCase()
    ) {
      if (!condition.requiredRole || condition.requiredRole === role) {
        shouldUnlock = true;
      }
    }

    if (shouldUnlock) {
      newlyUnlocked.push(item.id);
      unlockedEvidenceSet.add(item.id);
    }
  }

  const allUnlocked = scenario.evidence.filter((item) =>
    unlockedEvidenceSet.has(item.id)
  );

  return {
    newlyUnlockedEvidenceIds: newlyUnlocked,
    allUnlockedEvidence: allUnlocked,
  };
}
