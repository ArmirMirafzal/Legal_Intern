import { aiProvider } from "./gemini-provider";

export class IntentClassifier {
  static async classify(studentMessage: string) {
    return aiProvider.classifyStudentIntent(studentMessage);
  }
}
