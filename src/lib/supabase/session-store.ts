import fs from "fs";
import path from "path";
import type {
  SimulationSessionState,
  SimulationMessage,
  StudentAnalysisSubmission,
  EvaluationResult,
  DocumentDraftSubmission,
} from "@/types";

export interface SessionStorageRecord {
  session: SimulationSessionState;
  messages: SimulationMessage[];
  analysis?: StudentAnalysisSubmission;
  evaluation?: EvaluationResult;
  documentDraft?: DocumentDraftSubmission;
}

// Data directory on disk for persistent storage across Next.js dev server reloads
const DATA_DIR = path.join(process.cwd(), ".yuridiksim_data");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

// Attach to globalThis so hot module reloading in Next.js does not wipe out sessions
declare global {
  // eslint-disable-next-line no-var
  var __YURIDIKSIM_SESSIONS__: Map<string, SessionStorageRecord> | undefined;
}

if (!globalThis.__YURIDIKSIM_SESSIONS__) {
  globalThis.__YURIDIKSIM_SESSIONS__ = new Map<string, SessionStorageRecord>();
  loadFromDisk();
}

const memoryStore = globalThis.__YURIDIKSIM_SESSIONS__;

function loadFromDisk(): void {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item?.session?.id) {
            globalThis.__YURIDIKSIM_SESSIONS__?.set(item.session.id, item);
          }
        }
      }
    }
  } catch (e) {
    console.warn("Could not load sessions from disk:", e);
  }
}

function saveToDisk(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const arr = Array.from(memoryStore.values());
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(arr, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not persist sessions to disk:", e);
  }
}

export class SessionStore {
  static getSession(sessionId: string): SessionStorageRecord | null {
    let record = memoryStore.get(sessionId);
    if (!record) {
      // Try reloading from disk just in case another process wrote it
      loadFromDisk();
      record = memoryStore.get(sessionId);
    }
    return record || null;
  }

  static getOrCreateSession(
    sessionId: string,
    scenarioId: string = "CASE-001",
    userId: string = "demo-student-id"
  ): SessionStorageRecord {
    let record = this.getSession(sessionId);
    if (!record) {
      const session = this.createSession(sessionId, scenarioId, userId);
      record = memoryStore.get(session.id)!;
    }
    return record;
  }

  static createSession(
    sessionId: string,
    scenarioId: string,
    userId: string = "demo-student-id"
  ): SimulationSessionState {
    const session: SimulationSessionState = {
      id: sessionId,
      scenarioId,
      userId,
      currentStage: "applicant_interview",
      currentCharacterRole: "applicant",
      unlockedFactIds: ["FACT-001", "FACT-002"], // Public facts are unlocked from start
      unlockedEvidenceIds: [],
      studentNotes: "",
      startedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      status: "in_progress",
    };

    memoryStore.set(sessionId, {
      session,
      messages: [],
    });

    saveToDisk();
    return session;
  }

  static updateSession(session: SimulationSessionState): void {
    const existing = memoryStore.get(session.id);
    if (existing) {
      existing.session = session;
    } else {
      memoryStore.set(session.id, {
        session,
        messages: [],
      });
    }
    saveToDisk();
  }

  static addMessage(sessionId: string, message: SimulationMessage): void {
    const existing = memoryStore.get(sessionId);
    if (existing) {
      existing.messages.push(message);
      existing.session.lastActivityAt = new Date().toISOString();
      saveToDisk();
    }
  }

  static getMessages(sessionId: string): SimulationMessage[] {
    return memoryStore.get(sessionId)?.messages || [];
  }

  static saveNotes(sessionId: string, notes: string): void {
    const existing = memoryStore.get(sessionId);
    if (existing) {
      existing.session.studentNotes = notes;
      existing.session.lastActivityAt = new Date().toISOString();
      saveToDisk();
    }
  }

  static saveAnalysis(sessionId: string, analysis: StudentAnalysisSubmission): void {
    const existing = memoryStore.get(sessionId);
    if (existing) {
      existing.analysis = analysis;
      saveToDisk();
    }
  }

  static getAnalysis(sessionId: string): StudentAnalysisSubmission | null {
    return memoryStore.get(sessionId)?.analysis || null;
  }

  static saveEvaluation(sessionId: string, evaluation: EvaluationResult): void {
    const existing = memoryStore.get(sessionId);
    if (existing) {
      existing.evaluation = evaluation;
      saveToDisk();
    }
  }

  static getEvaluation(sessionId: string): EvaluationResult | null {
    return memoryStore.get(sessionId)?.evaluation || null;
  }

  static saveDocumentDraft(sessionId: string, draft: DocumentDraftSubmission): void {
    const existing = memoryStore.get(sessionId);
    if (existing) {
      existing.documentDraft = draft;
      saveToDisk();
    }
  }

  static getDocumentDraft(sessionId: string): DocumentDraftSubmission | null {
    return memoryStore.get(sessionId)?.documentDraft || null;
  }

  static listRecentSessions(userId?: string): SimulationSessionState[] {
    loadFromDisk();
    const all = Array.from(memoryStore.values()).map((r) => r.session);
    return all.sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime());
  }
}
