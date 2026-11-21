import type {
  CharacterProfile,
  ScenarioFact,
  StudentAnalysisSubmission,
  EvaluationResult,
  DocumentReviewResult,
} from "@/types";

export interface AIProvider {
  generateCharacterReply(
    character: CharacterProfile,
    authorizedFacts: ScenarioFact[],
    studentMessage: string,
    conversationHistory: { role: "user" | "model"; text: string }[]
  ): Promise<{ reply: string; detectedTopic?: string }>;

  classifyStudentIntent(
    studentMessage: string
  ): Promise<{ detectedTopic: string; intent: string; confidence: number; isPromptInjection: boolean }>;

  evaluateLegalAnalysis(
    submission: StudentAnalysisSubmission,
    scenarioTitleUz: string
  ): Promise<EvaluationResult>;

  reviewLegalDocument(
    sections: Record<string, string>,
    documentTitleUz: string
  ): Promise<DocumentReviewResult>;
}
