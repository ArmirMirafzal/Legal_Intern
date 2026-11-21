import { NextResponse } from "next/server";
import { SessionStore } from "@/lib/supabase/session-store";
import { ScenarioEngine } from "@/lib/scenario/scenario-engine";
import { getScenarioServerOnly } from "@/lib/scenario/scenario-loader";
import type { CharacterRole, SimulationStage } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionRecord = SessionStore.getOrCreateSession(id);

    const body = await request.json().catch(() => ({}));
    const { characterRole, targetStage } = body as {
      characterRole?: CharacterRole;
      targetStage?: SimulationStage;
    };

    let session = sessionRecord.session;

    if (characterRole && characterRole !== session.currentCharacterRole) {
      session = ScenarioEngine.switchCharacter(session, characterRole);

      // Check if we need to post initial message if this is first time chatting with character
      const hasSpokenToCharacter = sessionRecord.messages.some(
        (m) => m.characterRole === characterRole
      );
      if (!hasSpokenToCharacter) {
        const scenario = getScenarioServerOnly(session.scenarioId);
        const charObj = scenario?.characters.find((c) => c.role === characterRole);
        if (charObj) {
          SessionStore.addMessage(session.id, {
            id: "msg_init_" + characterRole + "_" + Date.now(),
            sessionId: session.id,
            characterRole,
            senderType: "character",
            content: charObj.initialMessage,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    if (targetStage && targetStage !== session.currentStage) {
      const hasAnalysis = Boolean(sessionRecord.analysis);
      session = ScenarioEngine.transitionStage(session, targetStage, hasAnalysis);
    }

    SessionStore.updateSession(session);

    return NextResponse.json({ session });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Bosqichni o'zgartirishda xatolik";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
