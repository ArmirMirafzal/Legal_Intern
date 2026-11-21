# LegalIntern — AI Architecture

## 1. Provider & SDK

- **Provider:** Google Gemini Developer API
- **SDK:** Official JavaScript SDK `@google/genai`
- **Default Model:** `gemini-3.8-flash` (configurable via `GEMINI_MODEL`)
- **Key Configuration:** `GEMINI_API_KEY`

## 2. Multi-Engine Architecture

Rather than relying on a single monolithic prompt, LegalIntern separates AI concerns into specialized engines:

```
                      Student Message
                             │
                             ▼
                 [ IntentClassifier ]
                             │ (Detected Topic)
                             ▼
                 [ ScenarioEngine ]  <─── Deterministic Rules & Facts
                             │ (Authorized Facts & Unlocked Evidence)
                             ▼
                 [ RoleplayEngine ]
                             │
                             ▼
                       Character Reply
```

### Specialized Modules:

1. **`RoleplayEngine` (`src/lib/ai/roleplay-engine.ts`)**:
   - Generates natural, in-character Uzbek dialogues.
   - Strictly bounded by authorized facts provided by the Scenario Engine.
   - Refuses prompt injections and resists hallucinating facts outside authorized knowledge.
2. **`IntentClassifier` (`src/lib/ai/intent-classifier.ts`)**:
   - Analyzes student questions to identify topics (e.g. `payment_history`, `cash_payment`, `child_expenses`).
   - Advisory only: does NOT directly unlock facts or evidence.
3. **`LegalReasoningEngine` (`src/lib/ai/legal-reasoning-engine.ts`)**:
   - Evaluates the 10-section legal analysis against the 100-point rubric.
   - Supports legally defensible alternative conclusions.
4. **`DocumentEngine` (`src/lib/ai/document-engine.ts`)**:
   - Analyzes student drafts for procedural omissions, missing claims, and lack of substantiation.
   - Generates structured issue cards (error, warning, suggestion) without writing the document for the student.

## 3. Resilience & Demo Mode

When `DEMO_MODE=true` or when `GEMINI_API_KEY` is not present, the `GeminiProvider` activates calibrated offline deterministic simulation logic. This allows instant demonstration, continuous integration testing, and local evaluation without external network dependencies.
