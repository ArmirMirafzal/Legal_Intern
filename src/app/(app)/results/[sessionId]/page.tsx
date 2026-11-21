"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RotateCw,
  Printer,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import type { EvaluationResult } from "@/types";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/simulations/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.evaluation) {
          setEvaluation(data.evaluation);
          try {
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 },
            });
          } catch {
            // Ignore confetti error
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">
        Mashg‘ulot natijalari yuklanmoqda...
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy-900">
          Ushbu mashg‘ulot hali baholanmagan
        </h2>
        <p className="text-xs text-slate-500">
          Iltimos, avval huquqiy tahlil va sud arizasini topshiring.
        </p>
        <Link
          href={`/simulation/${sessionId}/analysis`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold"
        >
          <span>Tahlil sahifasiga o‘tish</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Top Banner with Score */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Simulyatsiya muvaffaqiyatli yakunlandi
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Amaliy Mashg‘ulot Natijasi
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              CASE-001 bo'yicha barcha bosqichlar to'liq bosib o'tildi. Quyida 100 ballik ta'limiy rubrika bo'yicha mustaqil AI baholash natijasi keltirilgan.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 text-center flex-shrink-0 min-w-[140px]">
            <div className="text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
              Umumiy Ball
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white font-mono">
              {evaluation.overallScore}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">100 ball maksimal</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-slate-300">
            Sessiya ID: <span className="font-mono text-teal-300">#{sessionId.slice(-8)}</span>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs text-slate-200 hover:text-white px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Chop etish</span>
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900 bg-teal-400 hover:bg-teal-300 px-4 py-1.5 rounded-lg transition"
            >
              <span>Kabinetga qaytish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Rubric Breakdown Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-navy-900">
          Mezonlar bo'yicha batafsil baholash
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluation.criteriaScores?.map((crit) => (
            <div
              key={crit.criterionKey}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-navy-900 text-xs sm:text-sm">
                  {crit.criterionTitleUz}
                </span>
                <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  {crit.score} / {crit.maxScore} ball
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-teal-600 h-1.5 rounded-full"
                  style={{ width: `${(crit.score / crit.maxScore) * 100}%` }}
                />
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed pt-1">
                {crit.feedbackUz}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-navy-900 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Kuchli jihatlaringiz</span>
          </div>
          <div className="space-y-2">
            {evaluation.strengthsUz?.map((st, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-950 leading-relaxed"
              >
                {st}
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses / Improvements */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-navy-900 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Rivojlantirish lozim bo'lgan jihatlar</span>
          </div>
          <div className="space-y-2">
            {evaluation.weaknessesUz?.map((wk, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-950 leading-relaxed"
              >
                {wk}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Next Steps */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span>Tavsiya etiladigan keyingi amaliy qadamlar</span>
        </h3>
        <div className="space-y-2">
          {evaluation.nextLearningStepsUz?.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200"
            >
              <ChevronRight className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-slate-100 rounded-xl text-center text-xs text-slate-500">
        Ushbu ball ta'limiy tahlil sifatida taqdim etiladi va rasmiy universitet imtihon bahosi hisoblanmaydi.
      </div>
    </div>
  );
}
