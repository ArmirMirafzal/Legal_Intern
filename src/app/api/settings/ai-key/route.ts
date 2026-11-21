import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ENV_LOCAL_PATH = path.join(process.cwd(), ".env.local");

export async function GET() {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");
  return NextResponse.json({
    hasKey,
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const key = typeof body.apiKey === "string" ? body.apiKey.trim() : "";

    if (!key) {
      return NextResponse.json({ error: "API kalit bo'sh bo'lishi mumkin emas" }, { status: 400 });
    }

    // Set in runtime process.env immediately
    process.env.GEMINI_API_KEY = key;

    // Persist to .env.local
    let envContent = "";
    if (fs.existsSync(ENV_LOCAL_PATH)) {
      envContent = fs.readFileSync(ENV_LOCAL_PATH, "utf-8");
    }

    if (envContent.includes("GEMINI_API_KEY=")) {
      envContent = envContent.replace(/GEMINI_API_KEY=.*(\r?\n|$)/g, `GEMINI_API_KEY=${key}\n`);
    } else {
      envContent += `\nGEMINI_API_KEY=${key}\n`;
    }

    fs.writeFileSync(ENV_LOCAL_PATH, envContent, "utf-8");

    return NextResponse.json({ success: true, message: "Gemini API kaliti saqlandi va faollashtirildi!" });
  } catch (error) {
    console.error("Error saving API key:", error);
    return NextResponse.json({ error: "API kalitini saqlashda xatolik" }, { status: 500 });
  }
}
