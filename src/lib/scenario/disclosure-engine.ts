import type { ScenarioData, CharacterRole, ScenarioFact } from "@/types";

export interface DisclosureEvaluation {
  newlyUnlockedFactIds: string[];
  authorizedFactsForRole: ScenarioFact[];
}

/**
 * Deterministically evaluates fact disclosures based on the student's interaction topic,
 * current character role, and already unlocked facts.
 * 
 * Critical Security Rule:
 * Never allow a character to disclose facts outside their authorizedFactIds list.
 */
export function evaluateFactDisclosure(
  scenario: ScenarioData,
  role: CharacterRole,
  topic: string | undefined,
  currentlyUnlockedFactIds: string[]
): DisclosureEvaluation {
  const character = scenario.characters.find((c) => c.role === role);
  if (!character) {
    return { newlyUnlockedFactIds: [], authorizedFactsForRole: [] };
  }

  const roleAuthorizedSet = new Set(character.authorizedFactIds);
  const alreadyUnlockedSet = new Set(currentlyUnlockedFactIds);
  const newlyUnlocked: string[] = [];

  // Find candidate facts for this role and topic
  for (const fact of scenario.facts) {
    // Must be authorized for this character role
    if (!roleAuthorizedSet.has(fact.id)) continue;
    if (!fact.authorizedRoles.includes(role)) continue;

    // If fact is already public or unlocked, skip
    if (alreadyUnlockedSet.has(fact.id) || fact.isPublic) continue;

    // Check topic match
    if (topic && fact.topic.toLowerCase() === topic.toLowerCase()) {
      newlyUnlocked.push(fact.id);
      alreadyUnlockedSet.add(fact.id);
    }
  }

  // Get all facts this role is authorized to speak about (public or unlocked)
  const accessibleFacts = scenario.facts.filter((fact) => {
    const isRoleAuthorized = roleAuthorizedSet.has(fact.id) && fact.authorizedRoles.includes(role);
    const isKnown = fact.isPublic || alreadyUnlockedSet.has(fact.id);
    return isRoleAuthorized && isKnown;
  });

  return {
    newlyUnlockedFactIds: newlyUnlocked,
    authorizedFactsForRole: accessibleFacts,
  };
}
