"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  Users,
  CheckCircle2,
  ShieldCheck,
  Play,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { UI_LABELS } from "@/lib/constants/translations";

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
  const [scenario, setScenario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetch(`/api/cases/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.scenario) setScenario(data.scenario);
      })
      .catch((err) => console.error("Error loading case:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleStart = async () => {
    if (!scenario) return;
    setStarting(true);
    try {
      const res = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: scenario.id }),
      });
      const data = await res.json();
      if (data.session) {
        router.push(`/simulation/${data.session.id}`);
      }
    } catch (e) {
      console.error(e);
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500">
        Kazus ma'lumotlari yuklanmoqda...
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-navy-900 mb-2">Kazus topilmadi</h2>
        <Link href="/cases" className="text-sm font-semibold text-teal-700">
          Kazuslar kutubxonasiga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/cases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kutubxonaga qaytish</span>
        </Link>
      </div>

      {/* Case Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="px-3 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            {scenario.legalAreaUz}
          </span>
          <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
            {scenario.difficultyUz}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto">
            <Clock className="w-4 h-4 text-slate-400" />
            {scenario.estimatedDurationMinutes} daqiqa
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mb-3">
          {scenario.titleUz}
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
          {scenario.publicBriefUz?.summary}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
          <button
            onClick={handleStart}
            disabled={starting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition shadow-sm disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{starting ? "Ochilmoqda..." : "Simulyatsiyani boshlash"}</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left 2 Cols */}
        <div className="md:col-span-2 space-y-8">
          {/* Background and Mission */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-900">Ishning dastlabki holati</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {scenario.publicBriefUz?.background}
            </p>

            <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4 text-xs space-y-2">
              <span className="font-bold text-teal-900 block">
                Sizning vazifangiz (Huquqshunos-amaliyotchi):
              </span>
              <p className="text-teal-950 leading-relaxed">
                {scenario.publicBriefUz?.studentMission}
              </p>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-navy-900 mb-4">
              Kutilayotgan o‘quv natijalari
            </h3>
            <div className="space-y-2.5">
              {scenario.learningObjectivesUz?.map((obj: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Sources */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-navy-900">
                Amaldagi qonunchilik asoslari (lex.uz)
              </h3>
              <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                Tasdiqlangan
              </span>
            </div>
            <div className="space-y-3">
              {scenario.legalSources?.map((src: any) => (
                <div
                  key={src.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition text-xs"
                >
                  <div className="flex items-center justify-between font-semibold text-navy-900 mb-1">
                    <span>
                      {src.title} ({src.articleReference})
                    </span>
                    <a
                      href={src.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 text-[11px]"
                    >
                      lex.uz <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{src.summaryUz}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Characters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-navy-900 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              <span>Ish ishtirokchilari (AI Personajlar)</span>
            </h3>
            <div className="space-y-3">
              {scenario.characters?.map((c: any) => (
                <div
                  key={c.role}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1"
                >
                  <div className="font-bold text-navy-900">{c.name}</div>
                  <div className="text-teal-700 font-medium text-[11px]">
                    {c.uzbekTitle}
                  </div>
                  <div className="text-slate-500 text-[11px] leading-tight">
                    {c.relationToCase}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Educational Disclaimer */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Ta'limiy ogohlantirish</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/90">
              {UI_LABELS.educationalNotice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
