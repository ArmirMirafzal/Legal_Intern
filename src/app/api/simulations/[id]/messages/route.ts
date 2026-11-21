import { NextResponse } from "next/server";
import { SessionStore } from "@/lib/supabase/session-store";
import { getScenarioServerOnly } from "@/lib/scenario/scenario-loader";
import { ScenarioEngine } from "@/lib/scenario/scenario-engine";
import { IntentClassifier } from "@/lib/ai/intent-classifier";
import { RoleplayEngine } from "@/lib/ai/roleplay-engine";
import { SendMessageRequestSchema } from "@/lib/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let sessionRecord = SessionStore.getSession(id);

    if (!sessionRecord) {
      sessionRecord = SessionStore.getOrCreateSession(id, "CASE-001");
    }

    const body = await request.json().catch(() => ({}));
    const validated = SendMessageRequestSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Noto'g'ri so'rov formati" },
        { status: 400 }
      );
    }

    const { content, characterRole } = validated.data;
    let session = sessionRecord.session;

    // Switch role if requested
    if (characterRole && characterRole !== session.currentCharacterRole) {
      session = ScenarioEngine.switchCharacter(session, characterRole);
    }

    const scenario = getScenarioServerOnly(session.scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: "Kazus topilmadi" }, { status: 404 });
    }

    const character = scenario.characters.find(
      (c) => c.role === session.currentCharacterRole
    );
    if (!character) {
      return NextResponse.json({ error: "Ishtirokchi topilmadi" }, { status: 400 });
    }

    // 1. Classify student intent & topic
    const classification = await IntentClassifier.classify(content);

    // 2. Deterministic Scenario Turn Processing
    const turnResult = ScenarioEngine.processTurn(
      session,
      classification.detectedTopic
    );
    session = turnResult.session;

    // 3. Save student message
    const studentMsgId = "msg_stu_" + Math.random().toString(36).substring(2, 9);
    const studentMessage = {
      id: studentMsgId,
      sessionId: session.id,
      characterRole: session.currentCharacterRole,
      senderType: "student" as const,
      content,
      metadata: {
        detectedTopic: classification.detectedTopic,
      },
      createdAt: new Date().toISOString(),
    };
    SessionStore.addMessage(session.id, studentMessage);

    // 4. Build conversation history for this character only
    const characterHistory = sessionRecord.messages
      .filter((m) => m.characterRole === session.currentCharacterRole)
      .slice(-8)
      .map((m) => ({
        role: m.senderType === "student" ? ("user" as const) : ("model" as const),
        text: m.content,
      }));

    // 5. Generate character reply using strictly authorized facts and student context
    const roleplayReply = await RoleplayEngine.generateReply(
      character,
      turnResult.authorizedFactsForRole,
      content,
      characterHistory
    );

    // 6. Save character message
    const charMsgId = "msg_char_" + Math.random().toString(36).substring(2, 9);
    const characterMessage = {
      id: charMsgId,
      sessionId: session.id,
      characterRole: session.currentCharacterRole,
      senderType: "character" as const,
      content: roleplayReply.reply,
      metadata: {
        unlockedFactIds: turnResult.newlyUnlockedFactIds,
        unlockedEvidenceIds: turnResult.newlyUnlockedEvidenceIds,
      },
      createdAt: new Date().toISOString(),
    };
    SessionStore.addMessage(session.id, characterMessage);
    SessionStore.updateSession(session);

    return NextResponse.json({
      studentMessage,
      characterMessage,
      newlyUnlockedFactIds: turnResult.newlyUnlockedFactIds,
      newlyUnlockedEvidence: turnResult.newlyUnlockedEvidence,
      session,
    });
  } catch (error) {
    console.error("Error processing message:", error);
    return NextResponse.json(
      { error: "Xabarni qayta ishlashda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
