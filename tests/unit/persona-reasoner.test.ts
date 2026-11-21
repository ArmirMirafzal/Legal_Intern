import { describe, it, expect } from "vitest";
import { SemanticPersonaReasoner } from "../../src/lib/ai/semantic-persona-reasoner";
import { getScenarioServerOnly } from "../../src/lib/scenario/scenario-loader";

describe("SemanticPersonaReasoner — Dynamic Contextual Understanding without Hallucination", () => {
  const scenario = getScenarioServerOnly("CASE-001")!;
  const applicant = scenario.characters.find((c) => c.role === "applicant")!;
  const respondent = scenario.characters.find((c) => c.role === "respondent")!;
  const witness = scenario.characters.find((c) => c.role === "witness")!;

  it("Applicant should respond warmly and in-character to greetings", () => {
    const res = SemanticPersonaReasoner.generateDynamicReply(
      applicant,
      scenario.facts,
      "Assalomu alaykum Dilnoza opa, yaxshimisiz?"
    );
    expect(res.reply).toContain("Assalomu alaykum");
    expect(res.reply).toContain("rahmat");
  });

  it("Applicant should answer child age and school question accurately", () => {
    const res = SemanticPersonaReasoner.generateDynamicReply(
      applicant,
      scenario.facts,
      "O'g'lingiz Sanjar necha yoshda va nechanchi sinfda o'qiydi?"
    );
    expect(res.reply).toContain("Sanjar 8 yoshda");
    expect(res.reply).toContain("2-sinfda");
  });

  it("Applicant should specifically explain August Payme transfer without calling it regular alimony", () => {
    const res = SemanticPersonaReasoner.generateDynamicReply(
      applicant,
      scenario.facts,
      "Avgust oyida kartangizga 1.2 million so'm tushgan ekan, bu nima pul edi?"
    );
    expect(res.reply).toContain("1 million 200 ming");
    expect(res.reply).toContain("maktab");
    expect(res.detectedTopic).toBe("payment_history");
  });

  it("Applicant should emotionally dispute the 2 million cash envelope claim", () => {
    const res = SemanticPersonaReasoner.generateDynamicReply(
      applicant,
      scenario.facts,
      "Eringiz sentabrda Otabek orqali 2 million so'm naqd pul berganini aytyapti, bunga nima deysiz?"
    );
    expect(res.reply).toContain("Qanaqa 2 million");
    expect(res.reply).toContain("hech qanday");
    expect(res.detectedTopic).toBe("cash_payment");
  });

  it("Respondent (Jasur) should explain his side regarding the envelope", () => {
    const res = SemanticPersonaReasoner.generateDynamicReply(
      respondent,
      scenario.facts,
      "Sentabr oyida berilgan 2 million so'm naqd pul haqida tushuntiring."
    );
    expect(res.reply).toContain("Otabekka");
    expect(res.reply).toContain("konvert");
    expect(res.reply).toContain("2 million");
    expect(res.detectedTopic).toBe("cash_payment");
  });

  it("Witness (Otabek) should state he did not open or count the envelope contents", () => {
    const res = SemanticPersonaReasoner.generateDynamicReply(
      witness,
      scenario.facts,
      "Konvert ichida rostdan 2 million so'm borligini o'z ko'zingiz bilan ko'rganmisiz?"
    );
    expect(res.reply).toContain("ochib ko'rmaganman");
    expect(res.reply).toContain("sanamaganman");
  });
});
