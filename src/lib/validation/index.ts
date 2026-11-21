import { z } from "zod";

export const CharacterRoleSchema = z.enum(["applicant", "respondent", "witness"]);

export const SimulationStageSchema = z.enum([
  "briefing",
  "applicant_interview",
  "respondent_interview",
  "witness_interview",
  "evidence_review",
  "legal_analysis",
  "document_drafting",
  "evaluation",
  "completed",
]);

// Message input validation
export const SendMessageRequestSchema = z.object({
  content: z.string().min(1, "Xabar matni bo'sh bo'lishi mumkin emas").max(2000, "Xabar juda uzun"),
  characterRole: CharacterRoleSchema.optional(),
});

// Roleplay AI response schema
export const RoleplayResponseSchema = z.object({
  reply: z.string().min(1),
  role: CharacterRoleSchema,
  intent: z.string().optional(),
  detectedTopic: z.string().optional(),
  clarificationNeeded: z.boolean().optional().default(false),
});

// Intent classification schema
export const IntentClassificationSchema = z.object({
  detectedTopic: z.string().default("general_clarification"),
  intent: z.string().default("clarification"),
  confidence: z.number().min(0).max(1).default(0.8),
  isPromptInjection: z.boolean().default(false),
  summaryUz: z.string().optional(),
});

// Student analysis submission schema
export const StudentAnalysisSchema = z.object({
  sessionId: z.string().min(1),
  mainLegalIssue: z.string().min(5, "Asosiy huquqiy nizo ko'rsatilishi shart"),
  establishedFacts: z.string().min(5, "Aniqlangan faktlar ko'rsatilishi shart"),
  disputedFacts: z.string().min(5, "Nizoli faktlar ko'rsatilishi shart"),
  relevantEvidence: z.string().min(5, "Dalillar ro'yxati ko'rsatilishi shart"),
  evidenceReliabilityConcerns: z.string().default(""),
  missingEvidence: z.string().default(""),
  applicableLegalProvisions: z.string().min(5, "Qonun normalari ko'rsatilishi shart"),
  legalReasoning: z.string().min(10, "Huquqiy asoslash talab etiladi"),
  provisionalConclusion: z.string().min(5, "Dastlabki xulosa talab etiladi"),
  recommendedNextSteps: z.string().default(""),
  status: z.enum(["draft", "submitted"]).default("draft"),
});

// Criteria evaluation schema
export const CriterionScoreSchema = z.object({
  criterionKey: z.string(),
  criterionTitleUz: z.string(),
  score: z.number().min(0),
  maxScore: z.number().min(1),
  feedbackUz: z.string(),
});

export const EvaluationResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  criteriaScores: z.array(CriterionScoreSchema),
  strengthsUz: z.array(z.string()).default([]),
  weaknessesUz: z.array(z.string()).default([]),
  missingIssuesUz: z.array(z.string()).default([]),
  legalReferenceRecommendationsUz: z.array(z.string()).default([]),
  nextLearningStepsUz: z.array(z.string()).default([]),
});

// Document review schema
export const DocumentIssueSchema = z.object({
  id: z.string(),
  sectionKey: z.string(),
  severity: z.enum(["error", "warning", "suggestion"]),
  titleUz: z.string(),
  explanationUz: z.string(),
  suggestedImprovementUz: z.string(),
});

export const DocumentReviewResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  summaryFeedbackUz: z.string(),
  issues: z.array(DocumentIssueSchema),
  strengthsUz: z.array(z.string()),
  legalDisclaimerUz: z.string(),
});
