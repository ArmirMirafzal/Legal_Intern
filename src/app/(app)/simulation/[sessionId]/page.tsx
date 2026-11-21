"use client";

import { useEffect, useState, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Send,
  Sparkles,
  FileText,
  AlertCircle,
  FolderOpen,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lock,
  Edit3,
  Clock,
  Info,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";
import { UI_LABELS } from "@/lib/constants/translations";
import type {
  SimulationSessionState,
  SimulationMessage,
  EvidenceItem,
  CharacterRole,
} from "@/types";

export default function SimulationWorkspacePage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const router = useRouter();
  const { sessionId } = use(params);

  // Core Simulation State
  const [session, setSession] = useState<SimulationSessionState | null>(null);
  const [messages, setMessages] = useState<SimulationMessage[]>([]);
  const [unlockedEvidence, setUnlockedEvidence] = useState<EvidenceItem[]>([]);
  const [scenarioMeta, setScenarioMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Composer State
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Evidence & Notes State
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [studentNotes, setStudentNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [rightTab, setRightTab] = useState<"evidence" | "notes">("evidence");

  // Mobile Active Tab
  const [mobileTab, setMobileTab] = useState<"chat" | "overview" | "evidence">("chat");

  // Unlock toast notification
  const [unlockNotification, setUnlockNotification] = useState<string | null>(null);

  // Fetch initial session state
  const loadSession = () => {
    setLoading(true);
    fetch(`/api/simulations/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          setSession(data.session);
          setMessages(data.messages || []);
          setUnlockedEvidence(data.unlockedEvidence || []);
          setScenarioMeta(data.scenarioMeta || null);
          setStudentNotes(data.session.studentNotes || "");
        }
      })
      .catch((err) => console.error("Error loading simulation:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // Save student notes with debounce
  const handleNotesChange = (val: string) => {
    setStudentNotes(val);
    setSavingNotes(true);
    fetch(`/api/simulations/${sessionId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: val }),
    })
      .catch(console.error)
      .finally(() => setSavingNotes(false));
  };

  // Switch Character
  const handleSwitchCharacter = async (role: CharacterRole) => {
    if (!session || role === session.currentCharacterRole) return;
    try {
      const res = await fetch(`/api/simulations/${sessionId}/stage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterRole: role }),
      });
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
        // Refresh messages to fetch initial character message if newly loaded
        const freshRes = await fetch(`/api/simulations/${sessionId}`);
        const freshData = await freshRes.json();
        if (freshData.messages) setMessages(freshData.messages);
      }
    } catch (e) {
      console.error("Error switching character:", e);
    }
  };

  // Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || sending || !session) return;

    const text = inputMessage.trim();
    setInputMessage("");
    setSending(true);

    try {
      const res = await fetch(`/api/simulations/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text,
          characterRole: session.currentCharacterRole,
        }),
      });

      const data = await res.json();
      if (data.studentMessage && data.characterMessage) {
        setMessages((prev) => [...prev, data.studentMessage, data.characterMessage]);
        if (data.session) setSession(data.session);

        // Check if new evidence was unlocked
        if (data.newlyUnlockedEvidence && data.newlyUnlockedEvidence.length > 0) {
          setUnlockedEvidence((prev) => {
            const ids = new Set(prev.map((e) => e.id));
            const fresh = data.newlyUnlockedEvidence.filter((e: any) => !ids.has(e.id));
            return [...prev, ...fresh];
          });
          setUnlockNotification(
            `Yangi dalil ochildi: ${data.newlyUnlockedEvidence[0].titleUz}`
          );
          setTimeout(() => setUnlockNotification(null), 5000);
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
        Simulyatsiya ishchi xonasi yuklanmoqda...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-navy-900">Sessiya ma'lumotlari yangilanmoqda</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Simulyatsiya sessiyasi qayta tiklanmoqda. Quyidagi tugmani bosing.
        </p>
        <button
          onClick={loadSession}
          className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition"
        >
          Sessiyani yuklash
        </button>
      </div>
    );
  }

  const currentCharacter = scenarioMeta?.characters?.find(
    (c: any) => c.role === session.currentCharacterRole
  );

  const activeMessages = messages.filter(
    (m) => m.characterRole === session.currentCharacterRole
  );

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#F7F9FC]">
      {/* Evidence Unlock Notification Banner */}
      {unlockNotification && (
        <div className="bg-teal-700 text-white text-xs px-4 py-2 flex items-center justify-between animate-fadeIn z-30 shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span className="font-semibold">Muvaffaqiyat!</span>
            <span>{unlockNotification}</span>
          </div>
          <button
            onClick={() => setUnlockNotification(null)}
            className="text-teal-200 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Workspace Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-navy-900 flex items-center gap-2">
              <span>{scenarioMeta?.titleUz || "CASE-001"}</span>
              <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                {UI_LABELS.stages[session.currentStage] || session.currentStage}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/simulation/${sessionId}/analysis`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Huquqiy tahlilga o‘tish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Mobile Tab Selector */}
      <div className="md:hidden flex border-b border-slate-200 bg-white text-xs font-medium">
        <button
          onClick={() => setMobileTab("chat")}
          className={`flex-1 py-2.5 text-center border-b-2 transition ${
            mobileTab === "chat"
              ? "border-teal-700 text-teal-800 font-bold"
              : "border-transparent text-slate-500"
          }`}
        >
          Suhbat ({activeMessages.length})
        </button>
        <button
          onClick={() => setMobileTab("overview")}
          className={`flex-1 py-2.5 text-center border-b-2 transition ${
            mobileTab === "overview"
              ? "border-teal-700 text-teal-800 font-bold"
              : "border-transparent text-slate-500"
          }`}
        >
          Ish holati
        </button>
        <button
          onClick={() => setMobileTab("evidence")}
          className={`flex-1 py-2.5 text-center border-b-2 transition ${
            mobileTab === "evidence"
              ? "border-teal-700 text-teal-800 font-bold"
              : "border-transparent text-slate-500"
          }`}
        >
          Dalillar ({unlockedEvidence.length})
        </button>
      </div>

      {/* 3-Panel Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* PANEL 1: LEFT PANEL — Case Overview & Character Selector (approx 260px) */}
        <div
          className={`w-full md:w-64 lg:w-72 bg-white border-r border-slate-200 flex-shrink-0 flex-col overflow-y-auto ${
            mobileTab === "overview" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Character Switcher */}
          <div className="p-4 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Ishtirokchini tanlang
            </span>
            <div className="space-y-2">
              {scenarioMeta?.characters?.map((c: any) => {
                const isActive = session.currentCharacterRole === c.role;
                return (
                  <button
                    key={c.role}
                    onClick={() => handleSwitchCharacter(c.role)}
                    className={`w-full text-left p-3 rounded-xl border transition text-xs flex items-center justify-between ${
                      isActive
                        ? "bg-teal-50/80 border-teal-400 text-teal-950 font-semibold shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-navy-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        {c.uzbekTitle}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-teal-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Case Mission */}
          <div className="p-4 border-b border-slate-100 text-xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Sizning vazifangiz
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Har uchala ishtirokchi bilan suhbatlashib, to'lovlar tarixi, avgustdagi bank o'tkazmasi va sentabrdagi konvert voqeasini aniqlang.
            </p>
          </div>

          {/* Progress and Actions */}
          <div className="p-4 mt-auto border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Ochilgan dalillar:</span>
              <span className="font-bold text-teal-800 font-mono">
                {unlockedEvidence.length} / 5
              </span>
            </div>
            <Link
              href={`/simulation/${sessionId}/analysis`}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-navy-800 hover:bg-navy-900 text-white text-xs font-semibold transition"
            >
              <span>Huquqiy tahlil shakli</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* PANEL 2: CENTER PANEL — AI Conversation */}
        <div
          className={`flex-1 flex flex-col bg-slate-50 overflow-hidden ${
            mobileTab === "chat" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Active Character Identity Bar */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-navy-800 text-teal-300 font-bold flex items-center justify-center text-sm">
                {currentCharacter?.name?.[0] || "A"}
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-navy-900">
                  {currentCharacter?.name}
                </div>
                <div className="text-[11px] text-teal-700 font-medium">
                  {currentCharacter?.uzbekTitle}
                </div>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              To'g'ridan-to'g'ri so'roq jarayoni
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Users className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-xs">
                  {currentCharacter?.name} bilan suhbatni boshlash uchun quyida savolingizni yozing.
                </p>
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isStudent = msg.senderType === "student";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isStudent ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                      <span>{isStudent ? "Siz (Huquqshunos)" : currentCharacter?.name}</span>
                      <span>•</span>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isStudent
                          ? "bg-navy-800 text-white rounded-br-xs"
                          : "bg-white text-navy-900 border border-slate-200 rounded-bl-xs"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                );
              })
            )}

            {sending && (
              <div className="flex flex-col items-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3 text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce delay-150" />
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce delay-300" />
                  <span>{currentCharacter?.name} javob bermoqda...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <div className="bg-white border-t border-slate-200 p-3 sm:p-4 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={sending}
                placeholder={`${currentCharacter?.name || "Ishtirokchi"}ga savolingizni yozing... (Enter — yuborish)`}
                rows={2}
                className="w-full resize-none rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || sending}
                className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white transition flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
              <span>Maslahat: To'lov sanalari, naqd pul va cheklar haqida aniq so'rang.</span>
              <span className="hidden sm:inline">Shift + Enter yangi qator</span>
            </div>
          </div>
        </div>

        {/* PANEL 3: RIGHT PANEL — Evidence Workspace & Notes (approx 340px) */}
        <div
          className={`w-full md:w-80 lg:w-96 bg-white border-l border-slate-200 flex-shrink-0 flex-col overflow-hidden ${
            mobileTab === "evidence" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
            <button
              onClick={() => setRightTab("evidence")}
              className={`flex-1 py-3 text-center transition border-b-2 ${
                rightTab === "evidence"
                  ? "border-teal-700 text-teal-800 bg-white"
                  : "border-transparent text-slate-500 hover:text-navy-900"
              }`}
            >
              Dalillar ({unlockedEvidence.length})
            </button>
            <button
              onClick={() => setRightTab("notes")}
              className={`flex-1 py-3 text-center transition border-b-2 ${
                rightTab === "notes"
                  ? "border-teal-700 text-teal-800 bg-white"
                  : "border-transparent text-slate-500 hover:text-navy-900"
              }`}
            >
              Mening qaydlarim
            </button>
          </div>

          {/* Right Panel Body */}
          <div className="flex-1 overflow-y-auto p-4">
            {rightTab === "evidence" ? (
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Ish bo'yicha ochilgan dalillar
                </span>
                {unlockedEvidence.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 space-y-2">
                    <FolderOpen className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs">
                      Hozircha dalillar ochilmagan. Ishtirokchilar bilan suhbatda to'lovlar va xarajatlar haqida so'rang.
                    </p>
                  </div>
                ) : (
                  unlockedEvidence.map((evd) => (
                    <div
                      key={evd.id}
                      onClick={() => setSelectedEvidence(evd)}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-teal-50/50 hover:border-teal-300 transition cursor-pointer text-xs space-y-1 shadow-2xs group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-teal-700 bg-teal-100/60 px-1.5 py-0.5 rounded">
                          {evd.id}
                        </span>
                        <span className="text-[10px] text-slate-400">{evd.typeUz}</span>
                      </div>
                      <div className="font-bold text-navy-900 group-hover:text-teal-900">
                        {evd.titleUz}
                      </div>
                      <p className="text-slate-500 text-[11px] line-clamp-2">
                        {evd.descriptionUz}
                      </p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-col h-full space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Shaxsiy tergov qaydlari
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {savingNotes ? "Saqlanmoqda..." : "Avtomatik saqlanadi"}
                  </span>
                </div>
                <textarea
                  value={studentNotes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Aniqlangan faktlar, qarama-qarshiliklar va shubhalarni shu yerga yozib boring..."
                  className="flex-1 w-full p-3 rounded-xl border border-slate-200 text-xs text-navy-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition resize-none leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal / Dialog for Evidence Details */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {selectedEvidence.id}
                </span>
                <h3 className="font-bold text-base text-navy-900 mt-1">
                  {selectedEvidence.titleUz}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3 text-slate-700">
              <div>
                <span className="font-semibold text-slate-900 block mb-0.5">
                  Dalil matni / Mazmuni:
                </span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] whitespace-pre-wrap">
                  {selectedEvidence.contentUz}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-900 block mb-0.5">
                  Isbot kuchi va ishonchlilik jihatlari:
                </span>
                <p className="text-slate-600 leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60">
                  {selectedEvidence.reliabilityConsiderationsUz}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200 text-[11px]">
                  <span className="font-bold text-emerald-900 block mb-0.5">Nimani isbotlaydi:</span>
                  <span className="text-emerald-950">{selectedEvidence.whatItMayEstablishUz}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-200 text-[11px]">
                  <span className="font-bold text-rose-900 block mb-0.5">Nimani isbotlamaydi:</span>
                  <span className="text-rose-950">{selectedEvidence.whatItDoesNotEstablishUz}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedEvidence(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
