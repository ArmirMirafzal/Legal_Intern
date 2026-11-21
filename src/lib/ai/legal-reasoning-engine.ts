import { aiProvider } from "./gemini-provider";
import type { StudentAnalysisSubmission, EvaluationResult } from "@/types";

export class LegalReasoningEngine {
  static async evaluate(
    submission: StudentAnalysisSubmission,
    scenarioTitleUz: string = "CASE-001 — Aliment to‘lovlari bilan bog‘liq nizo"
  ): Promise<EvaluationResult> {
    return aiProvider.evaluateLegalAnalysis(submission, scenarioTitleUz);
  }
}
