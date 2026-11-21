import { NextResponse } from "next/server";
import { SessionStore } from "@/lib/supabase/session-store";
import type { DocumentDraftSubmission } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    SessionStore.getOrCreateSession(id);

    const body = await request.json().catch(() => ({}));
    const { sections, isSubmitted, reviewResult } = body;

    const draft: DocumentDraftSubmission = {
      sessionId: id,
      sections: sections || {},
      reviewResult,
      updatedAt: new Date().toISOString(),
      isSubmitted: Boolean(isSubmitted),
    };

    SessionStore.saveDocumentDraft(id, draft);

    return NextResponse.json({ success: true, draft });
  } catch (error) {
    console.error("Error saving document draft:", error);
    return NextResponse.json(
      { error: "Hujjat loyihasini saqlashda xatolik" },
      { status: 500 }
    );
  }
}
