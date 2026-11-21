import { NextResponse } from "next/server";
import { getSanitizedScenarioPublic } from "@/lib/scenario/scenario-loader";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const scenario = getSanitizedScenarioPublic(slug);
    if (!scenario) {
      return NextResponse.json(
        { error: "Bunday kazus topilmadi" },
        { status: 404 }
      );
    }
    return NextResponse.json({ scenario });
  } catch (error) {
    console.error("Error retrieving case:", error);
    return NextResponse.json(
      { error: "Kazus ma'lumotlarini yuklashda xatolik" },
      { status: 500 }
    );
  }
}
