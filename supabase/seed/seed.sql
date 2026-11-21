-- YuridikSim AI — Initial Seed Data for CASE-001

INSERT INTO public.scenarios (
  id,
  slug,
  title_uz,
  legal_area,
  difficulty,
  estimated_duration_minutes,
  learning_objectives_uz,
  public_brief_uz,
  scenario_data,
  version,
  status
) VALUES (
  'CASE-001',
  'aliment-tolovlari-nizosi',
  'Aliment to‘lovlari bilan bog‘liq nizo',
  'family_law',
  'orta',
  45,
  '[
    "Ariza beruvchi va javobgardan qonuniy ahamiyatga ega faktlarni izchil so‘rab olish",
    "Guvohning ko‘rsatmalarini bevosita ko‘rgan va eshitgan holatlari bo‘yicha tekshirish",
    "Da''vo vajlarini hujjatli dalillar bilan solishtirish",
    "Tomonlarning bayonotlaridagi nomuvofiqlik va ziddiyatlarni aniqlash",
    "Oila kodeksining alimentga oid normalarini to‘g‘ri qo‘llash",
    "Mantiqan asoslangan ta''limiy huquqiy xulosa va sud arizasi loyihasini tayyorlash"
  ]'::jsonb,
  '{
    "summary": "Er-xotin alohida yashaydi. Voyaga yetmagan 8 yoshli bola onasi (Ariza beruvchi) qaramog‘ida. Ona otaning moddiy ta''minot to''lovlari muntazam emasligini ta''kidlamoqda.",
    "background": "Tomonlar bir yildan buyon alohida yashaydi, notarial kelishuv yo''q.",
    "parties": [
      {"role": "applicant", "description": "Dilnoza Karimova — 1991-yilda tug''ilgan, bolaning onasi."},
      {"role": "respondent", "description": "Jasur Toshpo''latov — 1988-yilda tug''ilgan, bolaning otasi."},
      {"role": "witness", "description": "Otabek Ergashev — Dilnozaning tog''avachchasi."}
    ],
    "studentMission": "Ishtirokchilar bilan suhbat o''tkazing, dalillarni oching, ziddiyatlarni tahlil qiling va sud arizasi loyihasini tayyorlang."
  }'::jsonb,
  '{}'::jsonb,
  1,
  'published'
) ON CONFLICT (id) DO UPDATE SET
  title_uz = EXCLUDED.title_uz,
  updated_at = now();

-- Seed Legal Sources
INSERT INTO public.legal_sources (
  id, scenario_id, title, official_url, authority, article_reference, effective_date, verification_status, summary_uz
) VALUES 
('LAW-001', 'CASE-001', 'O''zbekiston Respublikasining Oila kodeksi', 'https://lex.uz/docs/-104720', 'O''zbekiston Respublikasi Oliy Majlisi', '96-modda', '01.09.1998', 'verified', 'Ota-ona voyaga yetmagan bolalariga ta''minot berishi shart.'),
('LAW-002', 'CASE-001', 'O''zbekiston Respublikasining Oila kodeksi', 'https://lex.uz/docs/-104720', 'O''zbekiston Respublikasi Oliy Majlisi', '99-modda', '01.09.1998', 'verified', 'Bir bola uchun daromadning 1/4 qismi miqdorida aliment undiriladi.'),
('LAW-003', 'CASE-001', 'O''zbekiston Respublikasining Oila kodeksi', 'https://lex.uz/docs/-104720', 'O''zbekiston Respublikasi Oliy Majlisi', '103-modda', '01.09.1998', 'verified', 'Alohida sharoitlarda qo''shimcha xarajatlarda ishtirok etish.'),
('LAW-004', 'CASE-001', 'O''zbekiston Respublikasining Oila kodeksi', 'https://lex.uz/docs/-104720', 'O''zbekiston Respublikasi Oliy Majlisi', '136-modda', '01.09.1998', 'verified', 'Aliment sudga murojaat qilingan kundan boshlab undirilishi tartibi.')
ON CONFLICT (id) DO NOTHING;
