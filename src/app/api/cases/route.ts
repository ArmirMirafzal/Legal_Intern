import { NextResponse } from "next/server";
import { listPublicScenarios } from "@/lib/scenario/scenario-loader";

export async function GET() {
  try {
    const cases = listPublicScenarios();
    return NextResponse.json({ cases });
  } catch (error) {
    console.error("Error listing cases:", error);
    return NextResponse.json(
      { error: "Kazuslarni yuklashda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
