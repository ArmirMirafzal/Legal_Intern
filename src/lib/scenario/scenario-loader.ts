import type { ScenarioData, CharacterProfile } from "@/types";
import case001 from "@/data/scenarios/case-001-child-maintenance.json";

// In-memory registry of scenarios
const SCENARIOS: Record<string, ScenarioData> = {
  "CASE-001": case001 as unknown as ScenarioData,
  "aliment-tolovlari-nizosi": case001 as unknown as ScenarioData,
};

/**
 * Loads the complete scenario data strictly for server-side operations.
 * NEVER return this directly to client browser queries!
 */
export function getScenarioServerOnly(identifier: string): ScenarioData | null {
  return SCENARIOS[identifier] || null;
}

/**
 * Returns a sanitized, client-safe scenario summary suitable for the case library and details page.
 * All hidden facts and unlock conditions are excluded.
 */
export function getSanitizedScenarioPublic(identifier: string) {
  const scenario = getScenarioServerOnly(identifier);
  if (!scenario) return null;

  return {
    id: scenario.id,
    slug: scenario.slug,
    titleUz: scenario.titleUz,
    legalArea: scenario.legalArea,
    legalAreaUz: scenario.legalAreaUz,
    difficulty: scenario.difficulty,
    difficultyUz: scenario.difficultyUz,
    estimatedDurationMinutes: scenario.estimatedDurationMinutes,
    learningObjectivesUz: scenario.learningObjectivesUz,
    publicBriefUz: scenario.publicBriefUz,
    characters: scenario.characters.map((c: CharacterProfile) => ({
      role: c.role,
      name: c.name,
      uzbekTitle: c.uzbekTitle,
      relationToCase: c.relationToCase,
      avatarUrl: c.avatarUrl,
      // Note: authorizedFactIds and private personality instructions are omitted!
    })),
    rubric: scenario.rubric,
    documentTask: scenario.documentTask,
    legalSources: scenario.legalSources,
  };
}

/**
 * List all available scenarios for the library page (public summaries only)
 */
export function listPublicScenarios() {
  return [
    getSanitizedScenarioPublic("CASE-001")!,
    // Upcoming placeholder cases
    {
      id: "CASE-002",
      slug: "noqonuniy-ishdan-boshatish",
      titleUz: "Mehnat shartnomasini noqonuniy bekor qilish",
      legalArea: "labour_law",
      legalAreaUz: "Mehnat huquqi",
      difficulty: "orta",
      difficultyUz: "O‘rta",
      estimatedDurationMinutes: 40,
      learningObjectivesUz: [
        "Xodimni ishdan bo'shatishning qonuniyligini tekshirish",
        "Ishga tiklash va majburiy progul haqini undirish tartibi"
      ],
      publicBriefUz: {
        summary: "Korxona xodimi intizomiy jazo chorasi noto'g'ri qo'llanilgan holda mehnat shartnomasi bekor qilinganini da'vo qilmoqda.",
        background: "O'zbekiston Respublikasining yangi tahrirdagi Mehnat kodeksi talablari bo'yicha nizoni ko'rib chiqish.",
        parties: [],
        studentMission: "Hozirda ishlab chiqilmoqda..."
      },
      characters: [],
      rubric: [],
      documentTask: null,
      legalSources: [],
      isUpcoming: true,
    },
    {
      id: "CASE-003",
      slug: "nuqsonli-mahsulot-qaytarmaslik",
      titleUz: "Kafolat muddati davrida nuqsonli tovar nizosi",
      legalArea: "consumer_protection",
      legalAreaUz: "Iste'molchilar huquqlarini himoya qilish",
      difficulty: "boshlangich",
      difficultyUz: "Boshlang‘ich",
      estimatedDurationMinutes: 30,
      learningObjectivesUz: [
        "Iste'molchilar huquqlari to'g'risidagi qonunni qo'llash",
        "Ekspertiza tayinlash va tovar narxini qaytarish"
      ],
      publicBriefUz: {
        summary: "Iste'molchi xarid qilgan maishiy texnika 2 haftada ishlamay qolgan, do'kon esa pulni qaytarishdan bosh tortmoqda.",
        background: "Iste'molchi huquqlari va da'vo xati tayyorlash amaliyoti.",
        parties: [],
        studentMission: "Hozirda ishlab chiqilmoqda..."
      },
      characters: [],
      rubric: [],
      documentTask: null,
      legalSources: [],
      isUpcoming: true,
    }
  ];
}
