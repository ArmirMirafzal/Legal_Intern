import { DEFAULT_EVALUATION_RUBRIC } from "./rubric";
import type { EvaluationResult } from "@/types";

/**
 * Validates and normalizes evaluation scores against the official rubric.
 * Guarantees that:
 * 1. Criterion scores do not exceed their max points.
 * 2. Overall score is the accurate arithmetic sum of all criteria.
 * 3. Every standard criterion has feedback.
 */
export function normalizeAndValidateEvaluation(
  rawEvaluation: Partial<EvaluationResult>
): EvaluationResult {
  const criteriaScores = DEFAULT_EVALUATION_RUBRIC.map((def) => {
    const matching = rawEvaluation.criteriaScores?.find(
      (c) => c.criterionKey === def.key
    );

    let score = matching ? Number(matching.score) : Math.round(def.maxScore * 0.7);
    if (isNaN(score) || score < 0) score = 0;
    if (score > def.maxScore) score = def.maxScore;

    return {
      criterionKey: def.key,
      criterionTitleUz: def.titleUz,
      score,
      maxScore: def.maxScore,
      feedbackUz:
        matching?.feedbackUz ||
        `${def.titleUz} bo'yicha talab qilingan asosiy elementlar qisman bayon etilgan.`,
    };
  });

  const overallScore = criteriaScores.reduce((acc, curr) => acc + curr.score, 0);

  return {
    id: rawEvaluation.id,
    sessionId: rawEvaluation.sessionId || "",
    overallScore,
    criteriaScores,
    strengthsUz: rawEvaluation.strengthsUz?.length
      ? rawEvaluation.strengthsUz
      : ["Dalillarni tahlil qilishga urinish ijobiy baholanadi."],
    weaknessesUz: rawEvaluation.weaknessesUz?.length
      ? rawEvaluation.weaknessesUz
      : ["Qonun moddalarining aniq bandlariga tayanishni kuchaytirish lozim."],
    missingIssuesUz: rawEvaluation.missingIssuesUz || [],
    legalReferenceRecommendationsUz: rawEvaluation.legalReferenceRecommendationsUz || [
      "O'zbekiston Respublikasi Oila kodeksi 99 va 136-moddalari",
    ],
    nextLearningStepsUz: rawEvaluation.nextLearningStepsUz || [
      "Sud amaliyoti bilan tanishish va ariza loyihasini qayta tahrirlash",
    ],
    evaluatedAt: rawEvaluation.evaluatedAt || new Date().toISOString(),
    isDemoSimulation: rawEvaluation.isDemoSimulation ?? false,
  };
}
