# LegalIntern — O'zbekiston Yuridik Ta'lim Texnologiyasi

> **AI-quvvatli yuridik kazus va hujjatlar amaliyoti platformasi**
> _AI-powered Legal Case Practice and Document Training Platform for Uzbekistan's Law Students_

---

## 🌟 Mahsulot Haqida (About the Product)

**LegalIntern** — O'zbekiston yuridik ta'limi tizimi uchun mo'ljallangan interaktiv amaliy simulyator. Talabalar quruq nazariyani yodlash bilan cheklanmasdan, haqiqiy tergov va himoya jarayonini boshdan kechiradilar:

1. **AI Personajlari bilan muloqot:** Ariza beruvchi (ona), Javobgar (ota) va Guvoh (qarindosh) bilan professional so'roq o'tkazish.
2. **Dalillarni ochish va tahlil qilish:** Bank cheklari, Telegram yozishmalari va guvoh tushuntirishlari o'rtasidagi ziddiyatlarni ochish.
3. **Mustaqil huquqiy tahlil:** 10 qismli tahlil shakli va Oila kodeksiga tayangan holda dastlabki pozitsiyani belgilash.
4. **Hujjat Laboratoriyasi (Document Lab):** Fuqarolik ishlari bo'yicha sudga kiritiladigan ariza loyihasini tuzish va AI orqali har bir xatolik bo'yicha tavsiyalar olish.
5. **100 Ballik Rubrika:** 8 ta asosiy mezon bo'yicha xolisona ta'limiy baholash va takliflar.

---

## 🚀 Texnologik Stek (Tech Stack)

- **Frontend:** Next.js (App Router), React, TypeScript (Strict Mode), Tailwind CSS, Lucide React, Canvas Confetti
- **Backend:** Next.js Route Handlers, Zod Validation, Supabase SSR
- **Database & Auth:** PostgreSQL with Row Level Security (RLS) via Supabase
- **AI Provider:** Google Gemini API (`gemini-3.8-flash`) via the official `@google/genai` SDK
- **Testing:** Vitest for unit & integration testing
- **Deployment:** Vercel & Supabase compatible

---

## 📂 Loyiha Tuzilmasi (Folder Map)

```text
yuridiksim-ai/
├── src/
│   ├── app/
│   │   ├── (marketing)/page.tsx           # Asosiy landing sahifasi
│   │   ├── (auth)/login & register/       # Kirish va ro'yxatdan o'tish
│   │   ├── (app)/dashboard/               # Talaba kabineti
│   │   ├── (app)/cases/                   # Kazuslar kutubxonasi
│   │   ├── (app)/cases/[slug]/            # Kazus tafsilotlari
│   │   ├── (app)/simulation/[sessionId]/  # 3 panelli simulyatsiya xonasi
│   │   ├── (app)/simulation/[id]/analysis # 10 qismli huquqiy tahlil shakli
│   │   ├── (app)/simulation/[id]/document # Hujjat laboratoriyasi (Document Lab)
│   │   ├── (app)/results/[sessionId]/     # 100 ballik baholash hisoboti
│   │   └── api/                           # Himoyalangan API endpointlar
│   ├── lib/
│   │   ├── ai/                            # Gemini provider, roleplay, classifier, review
│   │   ├── scenario/                      # Deterministik stsenariy mashinasi
│   │   ├── evaluation/                    # 100 ballik rubrika va baholash mantig'i
│   │   └── supabase/                      # Ma'lumotlar bazasi va sessiyalar
│   └── data/scenarios/                    # CASE-001 Oila huquqi kazusi
├── supabase/
│   ├── migrations/                        # PostgreSQL RLS migratsiyalari
│   └── seed/                              # Boshlang'ich seed ma'lumotlar
└── tests/                                 # Vitest avtomatlashtirilgan testlari
```

---

## ⚡ Qanday Ishga Tushiriladi? (Quickstart)

### 1. Bog'liqliklarni o'rnatish

```bash
npm install
```

### 2. Muhit o'zgaruvchilari

`.env.example` faylidan nusxa olib `.env.local` yarating:

```bash
cp .env.example .env.local
```

> **Eslatma:** Agar `GEMINI_API_KEY` yoki `NEXT_PUBLIC_SUPABASE_URL` ko'rsatilmagan bo'lsa, tizim avtomatik ravishda to'liq ta'limiy **Demo Mode** rejimida ishlaydi va barcha simulyatsiyani sinovdan o'tkazish imkonini beradi.

### 3. Testlarni ishga tushirish

```bash
npm test
```

### 4. Dasturni ishga tushirish

```bash
npm run dev
```

Brauzerda [http://localhost:3000](http://localhost:3000) manzilini oching.

### 5. Ishlab chiqarish (Production) build

```bash
npm run build
npm start
```

---

## ⚖️ Huquqiy Ogohlantirish (Educational Disclaimer)

LegalIntern platformasidagi barcha shaxslar, bank hisoblari, kvitansiyalar, yozishmalar va kazuslar sun'iy ravishda o'quv maqsadida yaratilgan bo'lib, professional advokatlik yoki rasmiy yuridik maslahat o'rnini bosmaydi.
Qonunchilik normalari [Lex.uz](https://lex.uz) rasmiy portali asosida keltirilgan.
