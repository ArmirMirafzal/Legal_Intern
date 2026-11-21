"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  Clock,
  Users,
  Play,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { UI_LABELS } from "@/lib/constants/translations";

export default function CasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [startingId, setStartingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => res.json())
      .then((data) => {
        if (data.cases) setCases(data.cases);
      })
      .catch((err) => console.error("Error loading cases:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleStart = async (scenarioId: string) => {
    setStartingId(scenarioId);
    try {
      const res = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId }),
      });
      const data = await res.json();
      if (data.session) {
        router.push(`/simulation/${data.session.id}`);
      }
    } catch (e) {
      console.error(e);
      setStartingId(null);
    }
  };

  const filteredCases = cases.filter((c) => {
    if (selectedArea !== "all" && c.legalArea !== selectedArea) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.titleUz.toLowerCase().includes(q);
      const matchArea = c.legalAreaUz.toLowerCase().includes(q);
      return matchTitle || matchArea;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Amaliyot markazi</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-900">
          Kazuslar kutubxonasi
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-2xl">
          O'zbekiston yurisdiksiyasiga xos haqiqiy amaliy vaziyatlar. O'zingiz qiziqqan huquq sohasini tanlang va simulyatsiyani boshlang.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedArea("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedArea === "all"
                ? "bg-navy-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Barchasi
          </button>
          <button
            onClick={() => setSelectedArea("family_law")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedArea === "family_law"
                ? "bg-teal-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Oila huquqi (1)
          </button>
          <button
            onClick={() => setSelectedArea("labour_law")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedArea === "labour_law"
                ? "bg-teal-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Mehnat huquqi
          </button>
          <button
            onClick={() => setSelectedArea("consumer_protection")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedArea === "consumer_protection"
                ? "bg-teal-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Iste'molchilar huquqlari
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Kazuslarni izlash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
          />
        </div>
      </div>

      {/* Case Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((c) => {
          const isPlayable = !c.isUpcoming;
          return (
            <div
              key={c.id}
              className={`bg-white rounded-2xl border transition flex flex-col justify-between overflow-hidden shadow-sm ${
                isPlayable
                  ? "border-teal-300 ring-1 ring-teal-500/20 hover:shadow-md"
                  : "border-slate-200 opacity-80"
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
                    {c.legalAreaUz}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {c.estimatedDurationMinutes} daqiqa
                  </span>
                </div>

                <h3 className="font-bold text-navy-900 text-lg mb-2 leading-snug">
                  {c.titleUz}
                </h3>

                <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-3">
                  {c.publicBriefUz?.summary}
                </p>

                {isPlayable ? (
                  <div className="space-y-2 mb-4 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Users className="w-3.5 h-3.5 text-teal-600" />
                      <span>{c.characters?.length || 3} ta AI ishtirokchisi mavjud</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>Lex.uz qonun normalari tasdiqlangan</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>Tez kunda qo‘shiladi (Keyingi yangilanishda)</span>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/cases/${c.slug}`}
                  className="text-xs font-semibold text-slate-600 hover:text-navy-900"
                >
                  Tafsilotlar
                </Link>

                {isPlayable ? (
                  <button
                    onClick={() => handleStart(c.id)}
                    disabled={startingId === c.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition shadow-sm disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>{startingId === c.id ? "Ochilmoqda..." : "Boshlash"}</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Mavjud emas</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
