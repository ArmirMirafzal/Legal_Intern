import { aiProvider } from "./gemini-provider";
import type { CharacterProfile, ScenarioFact } from "@/types";

export class RoleplayEngine {
  static async generateReply(
    character: CharacterProfile,
    authorizedFacts: ScenarioFact[],
    studentMessage: string,
    conversationHistory: { role: "user" | "model"; text: string }[] = []
  ): Promise<{ reply: string; detectedTopic?: string }> {
    return aiProvider.generateCharacterReply(
      character,
      authorizedFacts,
      studentMessage,
      conversationHistory
    );
  }
}
