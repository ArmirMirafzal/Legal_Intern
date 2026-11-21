import { NextResponse } from "next/server";
import { SessionStore } from "@/lib/supabase/session-store";
import { getScenarioServerOnly } from "@/lib/scenario/scenario-loader";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Auto-heal/get or create session to guarantee students never get a broken screen
    let sessionRecord = SessionStore.getSession(id);

    if (!sessionRecord) {
      sessionRecord = SessionStore.getOrCreateSession(id, "CASE-001");
      const scenario = getScenarioServerOnly(sessionRecord.session.scenarioId);
      const applicant = scenario?.characters.find((c) => c.role === "applicant");
      if (applicant) {
        SessionStore.addMessage(id, {
          id: "msg_init_" + id,
          sessionId: id,
          characterRole: "applicant",
          senderType: "character",
          content: applicant.initialMessage,
          createdAt: new Date().toISOString(),
        });
        sessionRecord = SessionStore.getSession(id)!;
      }
    }

    const scenario = getScenarioServerOnly(sessionRecord.session.scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: "Kazus topilmadi" }, { status: 404 });
    }

    // Only return unlocked evidence details to the client
    const unlockedEvidence = scenario.evidence.filter((e) =>
      sessionRecord.session.unlockedEvidenceIds.includes(e.id)
    );

    // Only return unlocked or public facts to the client
    const accessibleFacts = scenario.facts.filter(
      (f) => f.isPublic || sessionRecord.session.unlockedFactIds.includes(f.id)
    );

    return NextResponse.json({
      session: sessionRecord.session,
      messages: sessionRecord.messages,
      unlockedEvidence,
      accessibleFacts,
      analysis: sessionRecord.analysis || null,
      evaluation: sessionRecord.evaluation || null,
      documentDraft: sessionRecord.documentDraft || null,
      scenarioMeta: {
        id: scenario.id,
        titleUz: scenario.titleUz,
        legalAreaUz: scenario.legalAreaUz,
        difficultyUz: scenario.difficultyUz,
        characters: scenario.characters.map((c) => ({
          role: c.role,
          name: c.name,
          uzbekTitle: c.uzbekTitle,
          relationToCase: c.relationToCase,
          initialMessage: c.initialMessage,
        })),
        rubric: scenario.rubric,
        documentTask: scenario.documentTask,
        legalSources: scenario.legalSources,
      },
    });
  } catch (error) {
    console.error("Error fetching simulation:", error);
    return NextResponse.json(
      { error: "Sessiya ma'lumotlarini olishda xatolik" },
      { status: 500 }
    );
  }
}
