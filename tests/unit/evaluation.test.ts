import { describe, it, expect } from "vitest";
import { normalizeAndValidateEvaluation } from "../../src/lib/evaluation/scoring";
import { DEFAULT_EVALUATION_RUBRIC } from "../../src/lib/evaluation/rubric";

describe("Evaluation System & 100-Point Rubric", () => {
  it("should have total max score of exactly 100 points across 8 criteria", () => {
    const totalMax = DEFAULT_EVALUATION_RUBRIC.reduce((sum, c) => sum + c.maxScore, 0);
    expect(totalMax).toBe(100);
    expect(DEFAULT_EVALUATION_RUBRIC.length).toBe(8);
  });

  it("should cap scores exceeding criterion maximums", () => {
    const normalized = normalizeAndValidateEvaluation({
      sessionId: "test-sim",
      criteriaScores: [
        {
          criterionKey: "interview_quality",
          criterionTitleUz: "Muloqot sifati",
          score: 999, // Exceeds max 15
          maxScore: 15,
          feedbackUz: "Test",
        },
      ],
    });

    const crit = normalized.criteriaScores.find((c) => c.criterionKey === "interview_quality");
    expect(crit).toBeDefined();
    expect(crit!.score).toBeLessThanOrEqual(15);
  });

  it("should calculate overallScore as the exact sum of all criteria", () => {
    const normalized = normalizeAndValidateEvaluation({
      sessionId: "test-sim",
      criteriaScores: DEFAULT_EVALUATION_RUBRIC.map((def) => ({
        criterionKey: def.key,
        criterionTitleUz: def.titleUz,
        score: Math.floor(def.maxScore * 0.8),
        maxScore: def.maxScore,
        feedbackUz: "Yaxshi",
      })),
    });

    const sum = normalized.criteriaScores.reduce((acc, c) => acc + c.score, 0);
    expect(normalized.overallScore).toBe(sum);
  });
});
