import { NextResponse } from "next/server";
import { SessionStore } from "@/lib/supabase/session-store";
import { StudentAnalysisSchema } from "@/lib/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    SessionStore.getOrCreateSession(id);
    const body = await request.json().catch(() => ({}));
    
    const validated = StudentAnalysisSchema.safeParse({
      ...body,
      sessionId: id,
    });

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Maydonlar to'liq to'ldirilmagan" },
        { status: 400 }
      );
    }

    const submission = {
      ...validated.data,
      submittedAt: new Date().toISOString(),
    };

    SessionStore.saveAnalysis(id, submission);

    // If submitted, advance stage to document drafting
    if (submission.status === "submitted") {
      const sessionRecord = SessionStore.getSession(id);
      if (sessionRecord) {
        sessionRecord.session.currentStage = "document_drafting";
        SessionStore.updateSession(sessionRecord.session);
      }
    }

    return NextResponse.json({ success: true, analysis: submission });
  } catch (error) {
    console.error("Error saving analysis:", error);
    return NextResponse.json(
      { error: "Tahlilni saqlashda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
