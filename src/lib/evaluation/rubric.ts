import type { EvaluationCriterionDef } from "@/types";

export const DEFAULT_EVALUATION_RUBRIC: EvaluationCriterionDef[] = [
  {
    key: "interview_quality",
    titleUz: "Muloqot va so'roq sifati",
    maxScore: 15,
    descriptionUz: "Ishtirokchilarga maqsadli, mantiqiy va professional savollar berish, holatlarni ketma-ketlikda aniqlash.",
  },
  {
    key: "fact_discovery",
    titleUz: "Faktlarni aniqlash va to'liqlik",
    maxScore: 15,
    descriptionUz: "Alohida yashash davri, farzandning istiqomat joyi va moddiy to'lovlarning mavjudligini qayd etish.",
  },
  {
    key: "evidence_analysis",
    titleUz: "Dalillar tahlili va baholash",
    maxScore: 20,
    descriptionUz: "Bank cheki (EVD-001) va guvoh ko'rsatmasi (EVD-004) o'rtasidagi ziddiyatlarni ochib berish va ishonchliligini baholash.",
  },
  {
    key: "legal_issues",
    titleUz: "Huquqiy nizoni to'g'ri aniqlash",
    maxScore: 10,
    descriptionUz: "Aliment majburiyati va bolaning qo'shimcha xarajatlari o'rtasidagi farqni to'g'ri ajrata olish.",
  },
  {
    key: "legal_provisions",
    titleUz: "Qonun normalarini qo'llash (lex.uz)",
    maxScore: 10,
    descriptionUz: "O'zbekiston Respublikasi Oila kodeksining 96, 99, 103 va 136-moddalariga to'g'ri asoslanish.",
  },
  {
    key: "legal_reasoning",
    titleUz: "Huquqiy asoslash va mantiqiy xulosa",
    maxScore: 10,
    descriptionUz: "Faktlardan xulosaga o'tish mantiqi va da'vo talablarining qonuniy asoslantirilishi.",
  },
  {
    key: "document_structure",
    titleUz: "Hujjat tuzilishi va rasmiylashtirish",
    maxScore: 10,
    descriptionUz: "Tahlil va ariza loyihasi bo'limlarining to'liq va ketma-ket bayon etilganligi.",
  },
  {
    key: "clarity_communication",
    titleUz: "Yuridik til va ravonlik",
    maxScore: 10,
    descriptionUz: "O'zbek adabiy va professional yuridik tiliga rioya qilish, aniq va lo'nda bayon etish.",
  },
];
