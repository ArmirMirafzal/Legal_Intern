"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Award, Shield, BookOpen, LogOut, Sparkles } from "lucide-react";
import { UI_LABELS } from "@/lib/constants/translations";

export default function ProfilePage() {
  const [student] = useState({
    name: "Alisher Qodirov",
    email: "alisher.qodirov@student.tsul.uz",
    university: "Toshkent davlat yuridik universiteti (TDYU)",
    specialization: "Fuqarolik va oila huquqi",
    role: "Talaba / Amaliyotchi",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-navy-800 text-teal-300 flex items-center justify-center font-bold text-2xl shadow-sm flex-shrink-0">
          AQ
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200 mb-1">
            <Award className="w-3.5 h-3.5" />
            Amaliyotchi huquqshunos talaba
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">{student.name}</h1>
          <p className="text-slate-500 text-xs sm:text-sm">{student.email}</p>
          <p className="text-slate-600 text-xs">{student.university}</p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-semibold transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Tizimdan chiqish</span>
        </Link>
      </div>

      {/* Stats and Learning Profile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Boshlangan Kazuslar
          </div>
          <div className="text-2xl font-bold text-navy-900">1 ta</div>
          <div className="text-[11px] text-teal-700 mt-1">Oila huquqi bo'yicha</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Tekshirilgan Dalillar
          </div>
          <div className="text-2xl font-bold text-navy-900">5 ta</div>
          <div className="text-[11px] text-teal-700 mt-1">EVD-001 — EVD-005</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            O'quv Darajasi
          </div>
          <div className="text-2xl font-bold text-navy-900">O'rta</div>
          <div className="text-[11px] text-teal-700 mt-1">Yuridik tahlil va arizalar</div>
        </div>
      </div>

      {/* System Settings & Configuration Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-600" />
          <span>Tizim sozlamalari va Ta'lim Muhiti</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-semibold text-navy-900 block">AI Ta'minotchi (Google Gemini)</span>
              <span className="text-slate-500 text-[11px]">gemini-3.8-flash / @google/genai</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
              Faol
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-semibold text-navy-900 block">Ma'lumotlar bazasi (Supabase)</span>
              <span className="text-slate-500 text-[11px]">PostgreSQL RLS himoyalangan tuzilma</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
              Ulanishga tayyor
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-semibold text-navy-900 block">Qonunchilik bazasi</span>
              <span className="text-slate-500 text-[11px]">Lex.uz O'zbekiston Respublikasi Oila kodeksi</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
              Rasmiy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
