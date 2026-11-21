// Centralized UI Translations and System Constants (Uzbek Latin)

export const UI_LABELS = {
	// Brand
	appName: "LegalIntern",
	appTagline: "AI-quvvatli yuridik kazus va hujjatlar amaliyoti platformasi",
	educationalNotice:
		"Ta'limiy simulyatsiya: Taqdim etilgan barcha kazuslar, shaxslar, hujjatlar va dalillar sun'iy ravishda o'quv maqsadida yaratilgan bo'lib, professional yuridik maslahat o'rnini bosmaydi.",

	// Navigation
	nav: {
		home: "Bosh sahifa",
		dashboard: "Mening kabinetim",
		cases: "Kazuslar kutubxonasi",
		mySimulations: "Mening mashg‘ulotlarim",
		evidenceWorkspace: "Dalillar xonasi",
		legalAnalysis: "Huquqiy tahlil",
		documentLab: "Hujjat laboratoriyasi",
		results: "Natijalar",
		profile: "Profil",
		login: "Kirish",
		register: "Ro‘yxatdan o‘tish",
		logout: "Chiqish",
	},

	// Actions
	actions: {
		startSimulation: "Mashg‘ulotni boshlash",
		resumeSimulation: "Mashg‘ulotni davom ettirish",
		sendMessage: "Javob yuborish",
		typePlaceholder: "Savolingizni yoki murojaatingizni yozing...",
		saveDraft: "Qoralamani saqlash",
		submitAnalysis: "Xulosani topshirish",
		submitDocument: "Hujjatni yakuniy topshirish",
		requestAiReview: "AI tahlilini olish",
		viewEvidence: "Dalilni ko‘rish",
		backToDashboard: "Kabinetga qaytish",
		backToLibrary: "Kutubxonaga qaytish",
		proceedToNextStage: "Keyingi bosqichga o‘tish",
		retry: "Qayta urinish",
		exportPrint: "Chop etish / PDF",
	},

	// Stages
	stages: {
		briefing: "Kazus bilan tanishuv",
		applicant_interview: "Ariza beruvchi bilan suhbat",
		respondent_interview: "Javobgar bilan suhbat",
		witness_interview: "Guvoh bilan suhbat",
		evidence_review: "Dalillarni tekshirish",
		legal_analysis: "Huquqiy tahlil va xulosa",
		document_drafting: "Hujjat loyihasini tayyorlash",
		evaluation: "Baholash jarayoni",
		completed: "Mashg‘ulot yakunlandi",
	},

	// Difficulties
	difficulties: {
		boshlangich: "Boshlang‘ich",
		orta: "O‘rta",
		murakkab: "Murakkab",
	},

	// Legal areas
	legalAreas: {
		family_law: "Oila huquqi",
		labour_law: "Mehnat huquqi",
		civil_law: "Fuqarolik huquqi",
		consumer_protection: "Iste'molchilar huquqlarini himoya qilish",
		administrative_law: "Ma'muriy huquq",
	},

	// Roles
	roles: {
		applicant: "Ariza beruvchi (Da'vogar)",
		respondent: "Javobgar (Ikkinchi tomon)",
		witness: "Guvoh (Qarindosh)",
		system: "Tizim bildirishnomasi",
		student: "Huquqshunos-amaliyotchi (Talaba)",
	},

	// Analysis Form Sections
	analysisForm: {
		title: "Mustaqil huquqiy tahlil va pozitsiya",
		subtitle:
			"Kazus bo'yicha to'plangan faktlar, dalillar va O'zbekiston Respublikasi qonunchiligiga asoslangan holda o'z xulosangizni shakllantiring.",
		mainLegalIssue: {
			label: "1. Asosiy huquqiy nizo va masala",
			guidance:
				"Ushbu ishda qanday huquqiy munosabatlar va qonuniy nizo mavjud? Tomonlarning asosiy talablari nimadan iborat?",
			placeholder:
				"Masalan: Voyaga yetmagan bolaning ta'minoti uchun aliment undirish tartibi va oldingi to'lovlarning huquqiy tabiati...",
		},
		establishedFacts: {
			label: "2. Ish bo'yicha aniqlangan (isbotlangan) faktlar",
			guidance: "Tomonlarning bir xil ko'rsatmalari yoki hujjatlar bilan tasdiqlangan holatlar.",
			placeholder:
				"Tomonlar alohida yashaydi; voyaga yetmagan bola ariza beruvchi bilan yashaydi; bitta bank o'tkazmasi mavjud...",
		},
		disputedFacts: {
			label: "3. Tomonlar o'rtasida nizoli bo'lgan faktlar",
			guidance: "Qaysi holatlar bo'yicha tomonlarning ko'rsatmalari bir-biriga zid?",
			placeholder:
				"Naqd pul topshirilgani yoki yo'qligi; bank to'lovining maqsadi (alimentmi yoki boshqa xarajatmi)...",
		},
		relevantEvidence: {
			label: "4. Ishga aloqador mavjud dalillar",
			guidance: "Ochilgan va ko'zdan kechirilgan dalillar ro'yxati va ularning ahamiyati.",
			placeholder: "EVD-001 (bank cheki), EVD-002 (yozishmalar), EVD-004 (guvoh tushuntirishi)...",
		},
		evidenceReliabilityConcerns: {
			label: "5. Dalillarning ishonchliligi va nomaqbulligi masalalari",
			guidance: "Qaysi dalillar shubhali yoki to'liq isbot kuchiga ega emas?",
			placeholder:
				"Guvoh konvert ichida nima bo'lganini ko'rmagan; SMS yozishmada to'lov maqsadi aniq ko'rsatilmagan...",
		},
		missingEvidence: {
			label: "6. Ishda yetishmayotgan muhim ma'lumot va hujjatlar",
			guidance: "To'liq xulosa chiqarish uchun yana qanday rasmiy ma'lumotlar kerak bo'ladi?",
			placeholder:
				"Bank to'liq ko'chirmasi; tomonlarning rasmiy daromadlari to'g'risida ma'lumotnoma...",
		},
		applicableLegalProvisions: {
			label: "7. Qo'llaniladigan qonun hujjatlari (lex.uz)",
			guidance:
				"O'zbekiston Respublikasi Oila kodeksi va Oliy sud Plenumi tushuntirishlariga havolalar.",
			placeholder: "O'zbekiston Respublikasi Oila kodeksining 96, 99, 102-moddalari...",
		},
		legalReasoning: {
			label: "8. Huquqiy asoslash va mantiqiy zanjir",
			guidance: "Faktlar va qonun normalari o'rtasidagi bog'liqlikni batafsil izohlang.",
			placeholder:
				"Oila kodeksiga muvofiq ota-onaning voyaga yetmagan bolalariga ta'minot berish majburiyati qat'iy belgilangan...",
		},
		provisionalConclusion: {
			label: "9. Dastlabki huquqiy xulosa",
			guidance: "Ariza beruvchining da'vo qilish huquqi bormi va qanday natijaga erishish mumkin?",
			placeholder:
				"Ariza beruvchi sud orqali aliment undirish to'g'risida sud buyrug'i yoki da'vo arizasi bilan murojaat qilishga haqli...",
		},
		recommendedNextSteps: {
			label: "10. Tavsiya etiladigan keyingi amaliy qadamlar",
			guidance: "Mijozga qanday maslahat berasiz? Qanday arizalar tayyorlanishi lozim?",
			placeholder:
				"1) Maktab xarajatlari cheklarini to'plash; 2) Sudga ariza loyihasini rasmiylashtirish; 3) Mediatsiya imkoniyatini ko'rib chiqish...",
		},
	},

	// Document Lab
	documentLab: {
		title: "Ta'limiy hujjat laboratoriyasi",
		disclaimer:
			"Ta'limiy hujjat loyihasi. Rasmiy sudga yoki organga topshirishdan oldin malakali advokat tomonidan tekshirilishi shart.",
		draftingInstructions:
			"Quyidagi shablon bo'limlarini mustaqil to'ldiring. AI yordamida loyihani xatolarga tekshirib, tahrirlang.",
		requestReviewBtn: "Hujjatni AI tahlilidan o'tkazish",
		reviewInProgress: "Hujjat huquqiy va tuzilmaviy xatolarga tekshirilmoqda...",
		noIssuesFound: "Hujjatda qo'pol huquqiy xatolar aniqlanmadi. Yaxshi natija!",
	},
};
