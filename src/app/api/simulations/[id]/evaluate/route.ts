import { NextResponse } from "next/server";
import { SessionStore } from "@/lib/supabase/session-store";
import { LegalReasoningEngine } from "@/lib/ai/legal-reasoning-engine";
import { getScenarioServerOnly } from "@/lib/scenario/scenario-loader";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let sessionRecord = SessionStore.getSession(id);

    if (!sessionRecord || !sessionRecord.analysis) {
      sessionRecord = SessionStore.getOrCreateSession(id);
      if (!sessionRecord.analysis) {
        // Fallback default analysis if none submitted yet
        sessionRecord.analysis = {
          sessionId: id,
          mainLegalIssue: "Voyaga yetmagan bola ta'minoti uchun aliment undirish",
          establishedFacts: "Er-xotin bir yildan buyon alohida yashaydi, bola onasi bilan birga.",
          disputedFacts: "Sentabr oyidagi 2 mln so'm naqd pul nizosi.",
          relevantEvidence: "EVD-001 (1.2 mln so'mlik bank cheki).",
          evidenceReliabilityConcerns: "Guvoh konvert ichidagi pulni sanamagan.",
          missingEvidence: "Javobgarning oylik daromadi ma'lumotnomasi.",
          applicableLegalProvisions: "Oila kodeksi 96 va 99-moddalari.",
          legalReasoning: "Oila kodeksi 96-moddasiga binoan ota ta'minot berishi shart.",
          provisionalConclusion: "Sudga 1/4 qism miqdorida aliment undirish arizasi kiritilsin.",
          recommendedNextSteps: "Sudga murojaat qilish va cheklarni ilova qilish.",
          status: "submitted",
        };
      }
    }

    const scenario = getScenarioServerOnly(sessionRecord.session.scenarioId);
    const scenarioTitle = scenario?.titleUz || "CASE-001 — Aliment to‘lovlari bilan bog‘liq nizo";

    // Run evaluation engine
    const evaluation = await LegalReasoningEngine.evaluate(
      sessionRecord.analysis,
      scenarioTitle
    );

    SessionStore.saveEvaluation(id, evaluation);

    // Update session status to completed
    sessionRecord.session.currentStage = "completed";
    sessionRecord.session.status = "completed";
    sessionRecord.session.completedAt = new Date().toISOString();
    SessionStore.updateSession(sessionRecord.session);

    return NextResponse.json({ evaluation, session: sessionRecord.session });
  } catch (error) {
    console.error("Error evaluating analysis:", error);
    return NextResponse.json(
      { error: "Tahlilni baholashda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
