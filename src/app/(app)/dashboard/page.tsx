"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scale,
  BookOpen,
  ArrowRight,
  Clock,
  Award,
  CheckCircle2,
  FileText,
  Play,
  RotateCw,
  FolderOpen,
} from "lucide-react";
import { UI_LABELS } from "@/lib/constants/translations";
import type { SimulationSessionState } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SimulationSessionState[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetch("/api/simulations")
      .then((res) => res.json())
      .then((data) => {
        if (data.sessions) setSessions(data.sessions);
      })
      .catch((err) => console.error("Error loading sessions:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleStartCase001 = async () => {
    setStarting(true);
    try {
      const res = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: "CASE-001" }),
      });
      const data = await res.json();
      if (data.session) {
        router.push(`/simulation/${data.session.id}`);
      }
    } catch (e) {
      console.error("Error starting simulation:", e);
      setStarting(false);
    }
  };

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const inProgressSessions = sessions.filter((s) => s.status === "in_progress");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-4 border border-teal-400/30">
            <Award className="w-3.5 h-3.5" />
            Amaliy huquqiy simulyator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Xush kelibsiz, Bo'lajak Huquqshunos!
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Bugun Oila huquqi bo'yicha haqiqiy nizoni tergov qiling. Ariza beruvchi va javobgarni so'roq qilib, yashirin kvitansiyalarni oching va sud arizasi loyihasini tayyorlang.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleStartCase001}
              disabled={starting}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition shadow-sm disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{starting ? "Yuklanmoqda..." : "CASE-001 ni boshlash"}</span>
            </button>
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition border border-white/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>Barcha kazuslar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Mavjud Kazuslar</span>
            <FolderOpen className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-navy-900">3 ta</div>
          <div className="text-xs text-slate-500 mt-1">1 ta to'liq tayyor, 2 ta kutilmoqda</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Yakunlangan</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-navy-900">{completedSessions.length} ta</div>
          <div className="text-xs text-slate-500 mt-1">Amaliyot yakunlangan simulyatsiyalar</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Jarayonda</span>
            <RotateCw className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-navy-900">{inProgressSessions.length} ta</div>
          <div className="text-xs text-slate-500 mt-1">Davom ettirish mumkin bo'lgan ishlar</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">O'rtacha Ball</span>
            <Award className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-navy-900">
            {completedSessions.length > 0 ? "85 / 100" : "—"}
          </div>
          <div className="text-xs text-slate-500 mt-1">100 ballik ta'limiy rubrika bo'yicha</div>
        </div>
      </div>

      {/* Main Grid: Recommended Case & In-Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Featured Seed Case */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-900">Tavsiya etilgan amaliy mashg‘ulot</h2>
            <Link
              href="/cases"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              Barchasini ko‘rish <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-teal-300 transition">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
                Oila huquqi
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                O‘rta qiyinlik
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500 ml-auto">
                <Clock className="w-3.5 h-3.5" /> 45 daqiqa
              </span>
            </div>

            <h3 className="text-xl font-bold text-navy-900 mb-2">
              CASE-001 — Aliment to‘lovlari bilan bog‘liq nizo
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Er-xotin alohida yashaydi. Bola onasi qaramog'ida. Ota avgustda kartaga 1.2 mln so'm o'tkazganini va sentabrda qarindosh orqali 2 mln so'm naqd konvert berganini da'vo qilmoqda. Ona esa naqd pul olmaganini aytadi. Sizning vazifangiz — haqiqatni aniqlash va sud arizasini tayyorlash.
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-200 text-xs space-y-1.5 text-slate-600">
              <div className="font-semibold text-slate-800">Ushbu mashg‘ulotda nimalarni o'rganasiz:</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                Mijoz va javobgarni so'roq qilish hamda guvohning ko'rsatmasini tekshirish
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                Bank to'lov cheki (EVD-001) va yozishmalardagi ziddiyatlarni fosh qilish
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                O'zbekiston Oila kodeksi (96, 99-moddalar) bo'yicha da'vo talablarini shakllantirish
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/cases/aliment-tolovlari-nizosi"
                className="text-xs font-semibold text-slate-600 hover:text-navy-900"
              >
                Batafsil ma'lumot
              </Link>
              <button
                onClick={handleStartCase001}
                disabled={starting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition shadow-sm disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Mashg‘ulotni boshlash</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Active Sessions & Quick Resumes */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-navy-900">So‘nggi mashg‘ulotlar</h2>

          {inProgressSessions.length === 0 && completedSessions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="font-semibold text-sm text-navy-900 mb-1">
                Hozircha mashg‘ulotlar yo‘q
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                CASE-001 ni boshlab, ilk amaliy tajribangizni to'plang.
              </p>
              <button
                onClick={handleStartCase001}
                disabled={starting}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold hover:bg-teal-100 transition"
              >
                <Play className="w-3 h-3 fill-teal-800" />
                Boshlash
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-teal-300 transition"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-slate-400">#{s.id.slice(-6)}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        s.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {s.status === "completed" ? "Yakunlangan" : "Jarayonda"}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-navy-900 mb-1">
                    Aliment to‘lovlari nizosi
                  </div>
                  <div className="text-xs text-slate-500 mb-3">
                    Bosqich: {UI_LABELS.stages[s.currentStage] || s.currentStage}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {new Date(s.lastActivityAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <Link
                      href={
                        s.status === "completed"
                          ? `/results/${s.id}`
                          : `/simulation/${s.id}`
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800"
                    >
                      {s.status === "completed" ? "Natijalarni ko‘rish" : "Davom ettirish"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
