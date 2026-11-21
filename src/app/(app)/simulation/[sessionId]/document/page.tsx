"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Save,
  RotateCw,
  Lightbulb,
} from "lucide-react";
import { UI_LABELS } from "@/lib/constants/translations";
import type { DocumentReviewResult } from "@/types";

export default function DocumentLabPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const router = useRouter();
  const { sessionId } = use(params);

  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [sections, setSections] = useState<Record<string, string>>({
    court_and_parties: "",
    factual_background: "",
    evidence_and_maintenance_claims: "",
    legal_grounds: "",
    request_prayer: "",
    attachments: "",
  });

  const [reviewResult, setReviewResult] = useState<DocumentReviewResult | null>(null);

  useEffect(() => {
    fetch(`/api/simulations/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.documentDraft?.sections) {
          setSections(data.documentDraft.sections);
        }
        if (data.documentDraft?.reviewResult) {
          setReviewResult(data.documentDraft.reviewResult);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleSectionChange = (key: string, val: string) => {
    setSections((prev) => ({ ...prev, [key]: val }));
  };

  const handleAutoFillDraft = () => {
    setSections({
      court_and_parties:
        "Fuqarolik ishlari bo'yicha Shayxontohur tumanlararo sudiga\n\nDa'vogar: Karimova Dilnoza Baxodirovna\nToshkent sh., Chilonzor tumani, 12-uy, 45-xonadon.\nTel: +998 90 000-00-00\n\nJavobgar: Toshpo'latov Jasur Sunnatillayevich\nToshkent sh., Shayxontohur tumani, 4-uy, 18-xonadon.\nIsh joyi: 'Savdo Lider' MChJ savdo menejeri",

      factual_background:
        "Biz javobgar Toshpo'latov Jasur bilan 2015-yil 14-aprelda qonuniy nikohdan o'tganmiz. Birgalikdagi turmushimizdan 2016-yil 22-fevralda tug'ilgan o'g'limiz Toshpo'latov Sanjar Jasur o'g'li bor. Tomonlar o'rtasidagi kelishmovchiliklar sababli 2023-yil oktabr oyidan buyon alohida yashaymiz. Hozirda 8 yoshli Sanjar to'liq mening qaramog'imda va tarbiyamda yashab kelmoqda.",

      evidence_and_maintenance_claims:
        "Javobgar voyaga yetmagan bolasining moddiy ta'minotida yetarli va muntazam ishtirok etmayapti. Faqatgina 2024-yil 18-avgustda maktab formasi va darsliklar uchun iltimosimga ko'ra kartamga bir martalik 1,200,000 so'm o'tkazgan (to'lov cheki ilova qilinadi). Javobgar da'vo qilayotgan sentabr oyidagi 2,000,000 so'm naqd pulni esa men olmaganman; guvoh Otabek Ergashevning yozma tushuntirishiga ko'ra ushbu konvert uning avtomobilida qolib ketgan va menga berilmagan. Oramizda notarial tasdiqlangan kelishuv mavjud emas.",

      legal_grounds:
        "O'zbekiston Respublikasi Oila kodeksining 96-moddasiga muvofiq, ota-ona voyaga yetmagan bolalariga ta'minot berishi shart. Oila kodeksining 99-moddasiga ko'ra, agar aliment to'lash haqida ota-ona o'rtasida kelishuv bo'lmasa, voyaga yetmagan bir bola uchun ota-onaning oylik ish haqi va boshqa daromadining to'rtdan bir (1/4) qismi miqdorida sud orqali undiriladi. Oila kodeksining 136-moddasiga ko'ra aliment sudga murojaat qilingan kundan boshlab undiriladi.",

      request_prayer:
        "Yuqoridagilarga asosan hamda O'zbekiston Respublikasi Oila kodeksining 96, 99, 136-moddalariga tayanib, SUDDAN SO'RAYMAN:\n\nJavobgar Toshpo'latov Jasur Sunnatillayevichdan da'vogar Karimova Dilnoza Baxodirovna foydasiga 2016-yil 22-fevralda tug'ilgan voyaga yetmagan o'g'limiz Toshpo'latov Sanjar ta'minoti uchun uning barcha turdagi ish haqi va daromadlarining 1/4 qismi miqdorida ariza berilgan kundan boshlab bola voyaga yetgunga qadar har oy aliment undirib berishingizni.",

      attachments:
        "1. Nikoh to'g'risidagi guvohnoma nusxasi;\n2. Bolaning tug'ilganlik haqidagi guvohnomasi nusxasi;\n3. Mahalla fuqarolar yig'inidan bolaning ona qaramog'ida ekanligi haqida ma'lumotnoma;\n4. Elektron to'lov kvitansiyasi nusxasi (18.08.2024);\n5. Guvoh Otabek Ergashevning yozma tushuntirish xati nusxasi;\n6. Davlat boji to'langanligi kvitansiyasi (yoki to'lovdan ozod etilganlik asosi).",
    });
  };

  const handleRequestReview = async () => {
    setReviewing(true);
    try {
      const res = await fetch("/api/documents/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      const data = await res.json();
      if (data.review) {
        setReviewResult(data.review);
        // Save draft state
        await fetch(`/api/simulations/${sessionId}/document`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sections, reviewResult: data.review }),
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReviewing(false);
    }
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      // 1. Save final document
      await fetch(`/api/simulations/${sessionId}/document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections, isSubmitted: true, reviewResult }),
      });

      // 2. Trigger Evaluation Engine
      const evalRes = await fetch(`/api/simulations/${sessionId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const evalData = await evalRes.json();

      // 3. Navigate to results page
      router.push(`/results/${sessionId}`);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/simulation/${sessionId}/analysis`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Huquqiy tahlilga qaytish</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoFillDraft}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold hover:bg-teal-100 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Namunaviy arizani to'ldirish</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Chop etish</span>
          </button>
        </div>
      </div>

      {/* Title & Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4" />
          <span>Hujjat Laboratoriyasi</span>
        </div>
        <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight mb-2">
          {UI_LABELS.documentLab.title}
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          Sud arizasi loyihasini to'ldiring va AI orqali yuridik va strukturaviy xatolarni tekshirib oling.
        </p>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>{UI_LABELS.documentLab.disclaimer}</span>
        </div>
      </div>

      {/* Editor & AI Review Side-by-Side or Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Document Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Section 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              1. Sud nomi va taraflar (Kirish qismi)
            </label>
            <textarea
              rows={4}
              value={sections.court_and_parties}
              onChange={(e) => handleSectionChange("court_and_parties", e.target.value)}
              placeholder="Fuqarolik ishlari bo'yicha tumanlararo sudiga... Da'vogar... Javobgar..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono leading-relaxed"
            />
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              2. Ishning holatlari (Bayon qismi)
            </label>
            <textarea
              rows={4}
              value={sections.factual_background}
              onChange={(e) => handleSectionChange("factual_background", e.target.value)}
              placeholder="Nikoh, bolaning tug'ilishi, alohida yashash davri..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 leading-relaxed"
            />
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              3. Moddiy ta'minotning yetarli emasligi va dalillar
            </label>
            <textarea
              rows={4}
              value={sections.evidence_and_maintenance_claims}
              onChange={(e) =>
                handleSectionChange("evidence_and_maintenance_claims", e.target.value)
              }
              placeholder="Payme kvitansiyasi, naqd pulning yetib kelmaganligi..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 leading-relaxed"
            />
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              4. Huquqiy asoslar (Oila kodeksi)
            </label>
            <textarea
              rows={3}
              value={sections.legal_grounds}
              onChange={(e) => handleSectionChange("legal_grounds", e.target.value)}
              placeholder="Oila kodeksining 96, 99 va 136-moddalari..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 leading-relaxed"
            />
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              5. Suddan so'rov (Iltimosnoma qismi)
            </label>
            <textarea
              rows={3}
              value={sections.request_prayer}
              onChange={(e) => handleSectionChange("request_prayer", e.target.value)}
              placeholder="Suddan so'rayman: Javobgar daromadining 1/4 qismi miqdorida aliment undirib berishingizni..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 leading-relaxed"
            />
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              6. Ilovalar ro'yxati
            </label>
            <textarea
              rows={3}
              value={sections.attachments}
              onChange={(e) => handleSectionChange("attachments", e.target.value)}
              placeholder="1. Bolaning tug'ilganlik haqidagi guvohnomasi..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 leading-relaxed"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleRequestReview}
              disabled={reviewing}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs transition shadow-sm disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${reviewing ? "animate-spin" : ""}`} />
              <span>{reviewing ? "AI tahlil qilmoqda..." : "AI tahlilidan o‘tkazish"}</span>
            </button>

            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition shadow-sm disabled:opacity-50"
            >
              <span>{submitting ? "Baholanmoqda..." : "Yakuniy topshirish va Bahoni ko‘rish"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Col: AI Review & Recommendations Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>AI Tekshiruv Natijasi</span>
              </h3>
              {reviewResult && (
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  {reviewResult.overallScore} / 100 ball
                </span>
              )}
            </div>

            {!reviewResult ? (
              <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">
                  Arizani to'ldirgach, "AI tahlilidan o'tkazish" tugmasini bosing.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {reviewResult.summaryFeedbackUz}
                </p>

                {reviewResult.issues.length === 0 ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Hujjatda qo'pol xatoliklar topilmadi.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Aniqlangan kamchiliklar ({reviewResult.issues.length}):
                    </span>
                    {reviewResult.issues.map((iss) => (
                      <div
                        key={iss.id}
                        className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                          iss.severity === "error"
                            ? "bg-rose-50/60 border-rose-200 text-rose-950"
                            : iss.severity === "warning"
                            ? "bg-amber-50/60 border-amber-200 text-amber-950"
                            : "bg-teal-50/60 border-teal-200 text-teal-950"
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          {iss.severity === "error" ? (
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span>{iss.titleUz}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-700">
                          {iss.explanationUz}
                        </p>
                        <div className="text-[11px] font-semibold text-slate-800 bg-white/70 p-2 rounded-lg border border-slate-200/50">
                          Tavsiya: {iss.suggestedImprovementUz}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
