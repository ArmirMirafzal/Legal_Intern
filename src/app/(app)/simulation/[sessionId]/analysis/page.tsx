"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Save,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { UI_LABELS } from "@/lib/constants/translations";

export default function LegalAnalysisPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const router = useRouter();
  const { sessionId } = use(params);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [formData, setFormData] = useState({
    mainLegalIssue: "",
    establishedFacts: "",
    disputedFacts: "",
    relevantEvidence: "",
    evidenceReliabilityConcerns: "",
    missingEvidence: "",
    applicableLegalProvisions: "",
    legalReasoning: "",
    provisionalConclusion: "",
    recommendedNextSteps: "",
  });

  useEffect(() => {
    fetch(`/api/simulations/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.analysis) {
          setFormData({
            mainLegalIssue: data.analysis.mainLegalIssue || "",
            establishedFacts: data.analysis.establishedFacts || "",
            disputedFacts: data.analysis.disputedFacts || "",
            relevantEvidence: data.analysis.relevantEvidence || "",
            evidenceReliabilityConcerns: data.analysis.evidenceReliabilityConcerns || "",
            missingEvidence: data.analysis.missingEvidence || "",
            applicableLegalProvisions: data.analysis.applicableLegalProvisions || "",
            legalReasoning: data.analysis.legalReasoning || "",
            provisionalConclusion: data.analysis.provisionalConclusion || "",
            recommendedNextSteps: data.analysis.recommendedNextSteps || "",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      await fetch(`/api/simulations/${sessionId}/analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "draft" }),
      });
      setSaveMessage("Qoralama saqlandi");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (e) {
      console.error(e);
      setSaveMessage("Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  // Helper to fill reasoned answers for demo testing
  const handleAutoFillReasonedAnswers = () => {
    setFormData({
      mainLegalIssue:
        "Voyaga yetmagan bola ta'minoti uchun aliment undirish tartibi, o'tgan davrdagi to'lovlarning aliment hisobiga o'tishi va qo'shimcha ta'lim xarajatlarining huquqiy maqomi.",
      establishedFacts:
        "Tomonlar bir yildan buyon alohida yashaydi; 8 yoshli Sanjar to'liq onasi bilan birga yashaydi; 2024-yil avgustda Payme orqali 1,200,000 so'm o'tkazilgan (EVD-001); tomonlar o'rtasida notarial tasdiqlangan aliment kelishuvi tuzilmagan.",
      disputedFacts:
        "Jasurning sentabr oyida Otabek orqali 2,000,000 so'm naqd konvert bergani va uning Dilnozaga yetib borgan-bormaganligi; avgustdagi 1.2 mln so'm oylik alimentmi yoki maktab uchun qo'shimcha yordammi ekanligi.",
      relevantEvidence:
        "EVD-001 (Payme orqali 1.2 mln so'm to'lov kvitansiyasi); EVD-002 (Telegram yozishmasi skrinshoti); EVD-003 (maktab formasi va dori-darmonlar uchun 2.3 mln so'mlik fiskal cheklar); EVD-004 (guvoh Otabekning yozma tushuntirishi).",
      evidenceReliabilityConcerns:
        "EVD-004 tushuntirish xatiga ko'ra Otabek konvert ichidagi pulni sanamagan va uni Dilnozaga bermagan (mashinasida qolib ketgan). Demak, javobgarning 2 million so'm to'lagani haqidagi vaji isbotlanmagan va dalil sifatida qabul qilib bo'lmaydi.",
      missingEvidence:
        "Javobgar Toshpo'latov J.ning rasmiy ish joyidan oylik ish haqi ma'lumotnomasi va barcha bank hisobvaraqlari ko'chirmalari.",
      applicableLegalProvisions:
        "O'zbekiston Respublikasi Oila kodeksining 96-moddasi (ota-onaning ta'minot berish majburiyati), 99-moddasi (bitta bola uchun 1/4 qism aliment), 103-moddasi (qo'shimcha xarajatlar) va 136-moddasi (aliment undirish muddatlari).",
      legalReasoning:
        "Oila kodeksi 96-moddasiga ko'ra ota voyaga yetmagan bolasiga ta'minot berishi shart. Yozma kelishuv bo'lmagani sababli aliment sud orqali undirilishi lozim. Avgust oyidagi to'lov maktab xarajatiga oid bir martalik yordam sifatida berilgan. Sentabrdagi naqd pul esa da'vogarga yetib bormagani guvoh ko'rsatmasi bilan tasdiqlandi. Shu sababli da'vogar sudga murojaat qilishga to'la haqli.",
      provisionalConclusion:
        "Fuqarolik ishlari bo'yicha tumanlararo sudiga voyaga yetmagan Sanjarning ta'minoti uchun otaning barcha ish haqi va daromadlarining 1/4 qismi miqdorida aliment undirish to'g'risida ariza kiritilishi maqsadga muvofiq.",
      recommendedNextSteps:
        "1. Maktab va tibbiy cheklarni arizaga ilova qilish; 2. Sud arizasi loyihasini rasmiylashtirish; 3. Sud orqali otaning ish joyi ma'lumotnomasini talab qilib olish.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/simulations/${sessionId}/analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "submitted" }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/simulation/${sessionId}/document`);
      }
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/simulation/${sessionId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Suhbat va dalillarga qaytish</span>
        </Link>
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="text-xs text-emerald-600 font-medium">{saveMessage}</span>
          )}
          <button
            type="button"
            onClick={handleAutoFillReasonedAnswers}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold hover:bg-teal-100 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Namunaviy tahlilni to'ldirish (Tezkor sinov)</span>
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saqlanmoqda..." : "Qoralama"}</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4" />
          <span>Mustaqil Yuridik Tahlil (10 Bo'lim)</span>
        </div>
        <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight mb-2">
          {UI_LABELS.analysisForm.title}
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          {UI_LABELS.analysisForm.subtitle}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
            {UI_LABELS.analysisForm.mainLegalIssue.label}
          </label>
          <p className="text-[11px] text-slate-500">
            {UI_LABELS.analysisForm.mainLegalIssue.guidance}
          </p>
          <textarea
            required
            rows={3}
            value={formData.mainLegalIssue}
            onChange={(e) => handleChange("mainLegalIssue", e.target.value)}
            placeholder={UI_LABELS.analysisForm.mainLegalIssue.placeholder}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
          />
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
            {UI_LABELS.analysisForm.establishedFacts.label}
          </label>
          <p className="text-[11px] text-slate-500">
            {UI_LABELS.analysisForm.establishedFacts.guidance}
          </p>
          <textarea
            required
            rows={3}
            value={formData.establishedFacts}
            onChange={(e) => handleChange("establishedFacts", e.target.value)}
            placeholder={UI_LABELS.analysisForm.establishedFacts.placeholder}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
          />
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
            {UI_LABELS.analysisForm.disputedFacts.label}
          </label>
          <p className="text-[11px] text-slate-500">
            {UI_LABELS.analysisForm.disputedFacts.guidance}
          </p>
          <textarea
            required
            rows={3}
            value={formData.disputedFacts}
            onChange={(e) => handleChange("disputedFacts", e.target.value)}
            placeholder={UI_LABELS.analysisForm.disputedFacts.placeholder}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
          />
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
            {UI_LABELS.analysisForm.relevantEvidence.label}
          </label>
          <p className="text-[11px] text-slate-500">
            {UI_LABELS.analysisForm.relevantEvidence.guidance}
          </p>
          <textarea
            required
            rows={3}
            value={formData.relevantEvidence}
            onChange={(e) => handleChange("relevantEvidence", e.target.value)}
            placeholder={UI_LABELS.analysisForm.relevantEvidence.placeholder}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
          />
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
            {UI_LABELS.analysisForm.evidenceReliabilityConcerns.label}
          </label>
          <p className="text-[11px] text-slate-500">
            {UI_LABELS.analysisForm.evidenceReliabilityConcerns.guidance}
          </p>
          <textarea
            rows={3}
            value={formData.evidenceReliabilityConcerns}
            onChange={(e) => handleChange("evidenceReliabilityConcerns", e.target.value)}
            placeholder={UI_LABELS.analysisForm.evidenceReliabilityConcerns.placeholder}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
          />
        </div>

        {/* Section 6 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
            {UI_LABELS.analysisForm.missingEvidence.label}
          </label>
          <p className="text-[11px] text-slate-500">
            {UI_LABELS.analysisForm.missingEvidence.guidance}
          </p>
          <textarea
            rows={2}
            value={formData.missingEvidence}
            onChange={(e) => handleChange("missingEvidence", e.target.value)}
            placeholder={UI_LABELS.analysisForm.missingEvidence.placeholder}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
          />
        </div>

        {/* Section 7 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
            {UI_LABELS.analysisForm.applicableLegalProvisions.label}
          </label>
          <p className="text-[11px] text-slate-500">
            {UI_LABELS.analysisForm.applicableLegalProvisions.guidance}
          </p>
          <textarea
            required
            rows={2}
            value={formData.applicableLegalProvisions}
            onChange={(e) => handleChange("applicableLegalProvisions", e.target.value)}
            placeholder={UI_LABELS.analysisForm.applicableLegalProvisions.placeholder}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
          />
        </div>

        {/* Section 8 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
            {UI_LABELS.analysisForm.legalReasoning.label}
          </label>
          <p className="text-[11px] text-slate-500">
            {UI_LABELS.analysisForm.legalReasoning.guidance}
          </p>
          <textarea
            required
            rows={4}
            value={formData.legalReasoning}
            onChange={(e) => handleChange("legalReasoning", e.target.value)}
            placeholder={UI_LABELS.analysisForm.legalReasoning.placeholder}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
          />
        </div>

        {/* Section 9 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
            {UI_LABELS.analysisForm.provisionalConclusion.label}
          </label>
          <p className="text-[11px] text-slate-500">
            {UI_LABELS.analysisForm.provisionalConclusion.guidance}
          </p>
          <textarea
            required
            rows={3}
            value={formData.provisionalConclusion}
            onChange={(e) => handleChange("provisionalConclusion", e.target.value)}
            placeholder={UI_LABELS.analysisForm.provisionalConclusion.placeholder}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
          />
        </div>

        {/* Section 10 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
            {UI_LABELS.analysisForm.recommendedNextSteps.label}
          </label>
          <p className="text-[11px] text-slate-500">
            {UI_LABELS.analysisForm.recommendedNextSteps.guidance}
          </p>
          <textarea
            rows={2}
            value={formData.recommendedNextSteps}
            onChange={(e) => handleChange("recommendedNextSteps", e.target.value)}
            placeholder={UI_LABELS.analysisForm.recommendedNextSteps.placeholder}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
          />
        </div>

        {/* Submit Bar */}
        <div className="pt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
          >
            Qoralamani saqlash
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition shadow-sm disabled:opacity-50"
          >
            <span>{submitting ? "Topshirilmoqda..." : "Xulosani topshirish va Hujjat Labga o'tish"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
