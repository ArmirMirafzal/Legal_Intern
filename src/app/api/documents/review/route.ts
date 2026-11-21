import { NextResponse } from "next/server";
import { DocumentEngine } from "@/lib/ai/document-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { sections, documentTitleUz } = body;

    if (!sections || typeof sections !== "object") {
      return NextResponse.json(
        { error: "Hujjat bo'limlari to'liq ko'rsatilmagan" },
        { status: 400 }
      );
    }

    const review = await DocumentEngine.review(
      sections,
      documentTitleUz || "Voyaga yetmagan bola ta'minoti uchun aliment undirish to'g'risida sud arizasi"
    );

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error reviewing document:", error);
    return NextResponse.json(
      { error: "Hujjatni tekshirishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
