# YuridikSim AI — Scenario Engine Specification

## 1. Overview
The Scenario Engine (`src/lib/scenario/`) is the central deterministic source of truth. It guarantees that the LLM cannot:
- Disclose evidence before valid conditions are fulfilled.
- Reveal facts outside the active character's authorized domain.
- Alter chronological events or monetary transactions.

## 2. Information Boundaries & State Machine
The simulation operates across defined stages:
1. `briefing` — Public case facts only.
2. `applicant_interview` — Client consultation.
3. `respondent_interview` — Opposing party examination.
4. `witness_interview` — Impartial witness questioning.
5. `evidence_review` — Synthetic exhibit inspection.
6. `legal_analysis` — 10-section legal analysis form.
7. `document_drafting` — Court application drafting.
8. `evaluation` — 100-point rubric scoring.
9. `completed` — Results report & learning takeaways.

## 3. Fact and Evidence Unlock Triggers
- **Fact Disclosure:** When a student inquires about an approved topic (e.g. `cash_payment`), the `DisclosureEngine` checks if the active character has that fact in their `authorizedFactIds`. If valid, the fact is unlocked and added to the session's `unlockedFactIds`.
- **Evidence Unlock:** The `EvidenceEngine` checks if unlocked facts or stages meet the `unlockCondition` for exhibits (e.g. `EVD-001` through `EVD-005`). Only unlocked exhibits are rendered in the student's Evidence Workspace.
