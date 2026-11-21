import type { SimulationStage, CharacterRole } from "@/types";

export const STAGE_FLOW: SimulationStage[] = [
  "briefing",
  "applicant_interview",
  "respondent_interview",
  "witness_interview",
  "evidence_review",
  "legal_analysis",
  "document_drafting",
  "evaluation",
  "completed",
];

export const ROLE_STAGE_MAPPING: Record<CharacterRole, SimulationStage> = {
  applicant: "applicant_interview",
  respondent: "respondent_interview",
  witness: "witness_interview",
};

/**
 * Validates whether transition from fromStage to toStage is allowed.
 */
export function canTransitionStage(
  currentStage: SimulationStage,
  targetStage: SimulationStage,
  hasSubmittedAnalysis: boolean = false
): boolean {
  const currentIndex = STAGE_FLOW.indexOf(currentStage);
  const targetIndex = STAGE_FLOW.indexOf(targetStage);

  if (currentIndex === -1 || targetIndex === -1) return false;

  // Can always stay or go back to review previous stages
  if (targetIndex <= currentIndex) return true;

  // Interview jumping between applicant, respondent, and witness is flexible
  const interviewStages: SimulationStage[] = [
    "applicant_interview",
    "respondent_interview",
    "witness_interview",
    "evidence_review",
  ];
  if (interviewStages.includes(currentStage) && interviewStages.includes(targetStage)) {
    return true;
  }

  // To enter evaluation or document drafting, analysis must be ready/submitted
  if (targetStage === "evaluation" || targetStage === "document_drafting") {
    return targetIndex === currentIndex + 1 || hasSubmittedAnalysis;
  }

  // Linear progression forward by 1 step
  return targetIndex === currentIndex + 1;
}

/**
 * Get next stage in normal progression
 */
export function getNextStage(currentStage: SimulationStage): SimulationStage {
  const currentIndex = STAGE_FLOW.indexOf(currentStage);
  if (currentIndex >= 0 && currentIndex < STAGE_FLOW.length - 1) {
    return STAGE_FLOW[currentIndex + 1];
  }
  return currentStage;
}
