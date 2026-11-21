import { NextResponse } from "next/server";
import { getScenarioServerOnly } from "@/lib/scenario/scenario-loader";
import { SessionStore } from "@/lib/supabase/session-store";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const scenarioId = body.scenarioId || "CASE-001";

    const scenario = getScenarioServerOnly(scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: "Kazus topilmadi" }, { status: 404 });
    }

    const sessionId = "sim_" + Math.random().toString(36).substring(2, 10);
    const session = SessionStore.createSession(sessionId, scenario.id);

    // Initial greeting message from Applicant
    const applicant = scenario.characters.find((c) => c.role === "applicant");
    if (applicant) {
      SessionStore.addMessage(sessionId, {
        id: "msg_init",
        sessionId,
        characterRole: "applicant",
        senderType: "character",
        content: applicant.initialMessage,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error("Error creating simulation:", error);
    return NextResponse.json(
      { error: "Simulyatsiyani boshlashda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sessions = SessionStore.listRecentSessions();
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Mashg'ulotlar ro'yxatini yuklashda xatolik" },
      { status: 500 }
    );
  }
}
