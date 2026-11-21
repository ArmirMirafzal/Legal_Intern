import { NextResponse } from "next/server";
import { SessionStore } from "@/lib/supabase/session-store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    SessionStore.getOrCreateSession(id);
    const body = await request.json().catch(() => ({}));
    const notes = typeof body.notes === "string" ? body.notes : "";

    SessionStore.saveNotes(id, notes);
    return NextResponse.json({ success: true, notes });
  } catch (error) {
    console.error("Error saving notes:", error);
    return NextResponse.json({ error: "Qaydlarni saqlashda xatolik" }, { status: 500 });
  }
}
