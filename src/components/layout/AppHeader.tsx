"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Scale, BookOpen, User, Sparkles, Key, Check, X } from "lucide-react";
import { UI_LABELS } from "@/lib/constants/translations";

export function AppHeader() {
	const [showKeyModal, setShowKeyModal] = useState(false);
	const [apiKey, setApiKey] = useState("");
	const [hasKey, setHasKey] = useState(false);
	const [savingKey, setSavingKey] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);

	useEffect(() => {
		fetch("/api/settings/ai-key")
			.then((res) => res.json())
			.then((data) => {
				if (data.hasKey) setHasKey(true);
			})
			.catch(console.error);
	}, []);

	const handleSaveApiKey = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!apiKey.trim()) return;
		setSavingKey(true);
		setSaveSuccess(false);

		try {
			const res = await fetch("/api/settings/ai-key", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ apiKey }),
			});
			const data = await res.json();
			if (data.success) {
				setHasKey(true);
				setSaveSuccess(true);
				setTimeout(() => {
					setShowKeyModal(false);
					setSaveSuccess(false);
				}, 1500);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setSavingKey(false);
		}
	};

	return (
		<>
			<header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8">
				<div className="flex items-center gap-6">
					<Link href="/dashboard" className="flex items-center gap-2.5 group">
						<div className="w-9 h-9 rounded-lg bg-navy-800 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-teal-700 transition">
							<Scale className="w-5 h-5 text-teal-400 group-hover:text-white" />
						</div>
						<div>
							<span className="font-bold text-lg tracking-tight text-navy-900 block leading-tight">
								{UI_LABELS.appName}
							</span>
							<span className="text-[11px] text-slate-500 hidden sm:block">
								Yuridik kazus va hujjatlar amaliyoti
							</span>
						</div>
					</Link>

					<nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
						<Link
							href="/dashboard"
							className="px-3 py-1.5 rounded-md hover:text-navy-900 hover:bg-slate-100 transition"
						>
							{UI_LABELS.nav.dashboard}
						</Link>
						<Link
							href="/cases"
							className="px-3 py-1.5 rounded-md hover:text-navy-900 hover:bg-slate-100 transition flex items-center gap-1.5"
						>
							<BookOpen className="w-4 h-4 text-teal-600" />
							{UI_LABELS.nav.cases}
						</Link>
					</nav>
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={() => setShowKeyModal(true)}
						className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
							hasKey
								? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
								: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
						}`}
					>
						<Key className="w-3.5 h-3.5 text-teal-600" />
						<span>{hasKey ? "Gemini AI Faol" : "Gemini Kaliti"}</span>
					</button>

					<Link
						href="/cases"
						className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition"
					>
						<Sparkles className="w-3.5 h-3.5 text-teal-600" />
						<span>Yangi kazus</span>
					</Link>

					<Link
						href="/profile"
						className="flex items-center gap-2 pl-2 text-sm text-slate-700 hover:text-navy-900 transition"
					>
						<div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-medium">
							<User className="w-4 h-4" />
						</div>
						<span className="hidden lg:inline text-xs font-medium">Talaba</span>
					</Link>
				</div>
			</header>

			{/* API Key Modal */}
			{showKeyModal && (
				<div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
					<div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
						<div className="flex items-center justify-between pb-2 border-b border-slate-100">
							<div className="flex items-center gap-2 font-bold text-navy-900 text-base">
								<Key className="w-5 h-5 text-teal-600" />
								<span>Google Gemini API Sozlamasi</span>
							</div>
							<button
								onClick={() => setShowKeyModal(false)}
								className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<p className="text-xs text-slate-600 leading-relaxed">
							Google Gemini API kalitingizni kiriting. Kalit kiritilmagan taqdirda ham LegalIntern
							stsenariy qoidalari asosidagi chuqur semantik personaj modeli bilan to'liq ishlaydi.
						</p>

						<form onSubmit={handleSaveApiKey} className="space-y-4">
							<div>
								<label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
									Gemini API Kaliti (AI Studio)
								</label>
								<input
									type="password"
									value={apiKey}
									onChange={(e) => setApiKey(e.target.value)}
									placeholder="AIzaSy..."
									className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
								/>
							</div>

							{saveSuccess && (
								<div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center gap-1.5">
									<Check className="w-4 h-4 text-emerald-600" />
									<span>Kalit muvaffaqiyatli saqlandi va faollashtirildi!</span>
								</div>
							)}

							<div className="flex items-center justify-end gap-2 pt-2">
								<button
									type="button"
									onClick={() => setShowKeyModal(false)}
									className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
								>
									Yopish
								</button>
								<button
									type="submit"
									disabled={savingKey || !apiKey.trim()}
									className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 disabled:opacity-50 transition"
								>
									{savingKey ? "Saqlanmoqda..." : "Saqlash va Faollashtirish"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
