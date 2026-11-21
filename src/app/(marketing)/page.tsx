import Link from "next/link";
import { Scale, ArrowRight, ShieldCheck, FileText, CheckCircle2, Award } from "lucide-react";
import { UI_LABELS } from "@/lib/constants/translations";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-navy-950 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-800 text-white flex items-center justify-center font-bold shadow-md">
              <Scale className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-navy-900 block leading-tight">
                {UI_LABELS.appName}
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:block">
                O'zbekiston yuridik ta'lim texnologiyasi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-navy-900 transition"
            >
              Kirish
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition shadow-sm"
            >
              Mashg‘ulotni boshlash
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-white via-slate-50 to-[#F7F9FC] border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            O'zbekiston yurisdiksiyasi • Lex.uz qonunchiligi
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy-900 leading-[1.15] mb-6">
            Huquqshunoslikni o‘qibgina qolmang —{" "}
            <span className="text-teal-700">amalda mashq qiling.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Haqiqiy ishlarga asoslangan to'qima yuridik kazuslar. AI personajlari (ariza beruvchi, javobgar, guvoh) bilan suhbat o'tkazing, maxfiy dalillarni oching, ziddiyatlarni fosh qiling va sud arizalarini mustaqil loyihalashtiring.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-navy-800 text-white font-semibold hover:bg-teal-700 transition shadow-md"
            >
              <span>Kazuslarni boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cases/aliment-tolovlari-nizosi"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-navy-800 border border-slate-300 font-semibold hover:bg-slate-50 transition shadow-sm"
            >
              <span>CASE-001 Namoyishini ko‘rish</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-3">
            Amaliy huquqiy ko'nikmalarni rivojlantirish tizimi
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Oddiy test savollari emas, balki to'liq tergov va himoya jarayonini simulyatsiya qiluvchi tizim.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-300 transition">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mb-4 font-bold">
              1
            </div>
            <h3 className="font-bold text-navy-900 text-lg mb-2">Muloqot va tergov</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Mijoz, qarama-qarshi tomon va guvohlardan to'g'ri savollar orqali faktlarni aniqlash.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-300 transition">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mb-4 font-bold">
              2
            </div>
            <h3 className="font-bold text-navy-900 text-lg mb-2">Dalillar xonasi</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Bank cheklari, SMS yozishmalar va guvoh ko'rsatmalari o'rtasidagi ziddiyatlarni fosh qilish.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-300 transition">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mb-4 font-bold">
              3
            </div>
            <h3 className="font-bold text-navy-900 text-lg mb-2">Mustaqil huquqiy tahlil</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              10 qismli kasbiy tahlil shakli va Oila kodeksi normalarini amaliyotda qo'llash.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-300 transition">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mb-4 font-bold">
              4
            </div>
            <h3 className="font-bold text-navy-900 text-lg mb-2">Hujjat laboratoriyasi</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Sud arizasini tayyorlash va AI orqali har bir xato va kamchilik bo'yicha tavsiyalar olish.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="font-medium text-slate-700">
            {UI_LABELS.appName} — Huquqiy ta'lim texnologiyasi platformasi
          </p>
          <p className="max-w-xl mx-auto text-slate-400">
            {UI_LABELS.educationalNotice}
          </p>
        </div>
      </footer>
    </div>
  );
}
