import { aiProvider } from "./gemini-provider";
import type { DocumentReviewResult } from "@/types";

export class DocumentEngine {
  static async review(
    sections: Record<string, string>,
    documentTitleUz: string = "Sud arizasi loyihasi"
  ): Promise<DocumentReviewResult> {
    return aiProvider.reviewLegalDocument(sections, documentTitleUz);
  }
}
