# AGENTS.md — YuridikSim AI
## Agent Workflows, Product Principles & Engineering Standards

**Project:** YuridikSim AI
**Product Type:** AI-Powered Legal Case Practice and Document Training Platform
**Primary Language:** Uzbek (Latin script)
**Jurisdiction:** Republic of Uzbekistan
**Document Purpose:** Define mandatory instructions, architectural principles, development standards, security requirements, and operational rules for all AI agents and developers working on this project.

---

# 1. PROJECT MISSION

YuridikSim AI is an AI-powered legal education platform designed to help law students in Uzbekistan develop practical legal skills through controlled, fictional, interactive case simulations.

The platform bridges the gap between theoretical legal education and practical legal work.

Students act as trainee legal professionals and interact with AI-controlled fictional participants to practice:

1. Client and witness interviewing.
2. Fact discovery and clarification.
3. Identification of contradictions.
4. Evidence collection and assessment.
5. Legal issue identification.
6. Legal research and application of Uzbekistan's legal framework.
7. Independent legal reasoning and conclusion writing.
8. Legal document drafting.
9. Professional communication.
10. Critical thinking and structured problem-solving.

The platform also provides structured AI-assisted feedback to help students identify weaknesses, understand mistakes, and improve their practical legal competencies.

## 1.1 Core Product Philosophy

YuridikSim AI is NOT a generic chatbot, a virtual courtroom, or a conventional Learning Management System (LMS).

Its core product is an interactive legal practice environment in which students learn by investigating and solving fictional legal cases.

The chatbot is one interaction interface within the broader simulation system.

The product must prioritize:

- Active learning over passive information consumption.
- Practical legal skills over memorization.
- Independent reasoning over AI-generated answers.
- Verified legal sources over unsupported AI responses.
- Controlled simulations over unrestricted AI conversations.
- Meaningful feedback over simplistic numerical scores.

## 1.2 MVP Priorities

The initial MVP focuses on:

- Student dashboard.
- Legal case library.
- One complete fictional legal scenario.
- AI-controlled character roleplay.
- Deterministic fact and evidence disclosure.
- Evidence analysis workspace.
- Independent legal analysis submission.
- AI-assisted evaluation.
- Legal document drafting and review.
- Student progress and results.

Voice messages, real-time voice conversations, video interactions, institutional management, payments, and large-scale legal source automation are outside the initial MVP scope.

Do not implement excluded features unless explicitly requested.

---

# 2. AGENT RESPONSIBILITIES AND WORKING RULES

All AI agents and developers must follow this document.

## 2.1 Inspect Before Implementing

Before modifying the codebase:

1. Inspect the existing project structure.
2. Read this `AGENTS.md`.
3. Read relevant files under `docs/`.
4. Understand existing components, services, database schemas, and conventions.
5. Identify existing functionality that can be reused.
6. Determine whether the requested change affects other modules.

Never assume that a feature does not exist without inspecting the codebase.

Do not unnecessarily recreate or overwrite existing files.

## 2.2 Plan Complex Tasks

For substantial features:

1. Identify the expected outcome.
2. Identify affected files and modules.
3. Define implementation steps.
4. Identify dependencies and risks.
5. Implement the feature.
6. Run appropriate tests.
7. Fix discovered issues.
8. Update relevant documentation.

Avoid unnecessary planning for small, straightforward corrections.

## 2.3 Implement, Do Not Merely Describe

When asked to build a feature:

- Implement the actual functionality.
- Connect the frontend to the backend.
- Connect backend functionality to the database where necessary.
- Integrate AI services when required.
- Add validation and error handling.
- Test the complete workflow.

Do not consider any feature complete merely because its UI has been created.

Never replace a requested functional implementation with static mockups or hardcoded demonstration data.

## 2.4 Preserve Existing Work

Before changing existing functionality:

- Understand its current behavior.
- Identify dependencies.
- Preserve existing working integrations.
- Avoid unnecessary rewrites.
- Avoid destructive database changes.
- Do not delete user data or project files without explicit authorization.

Use incremental changes whenever possible.

## 2.5 Communicate Progress Clearly

After substantial implementation work, report:

- What was completed.
- Which files or modules were changed.
- What was tested.
- Whether tests passed.
- What remains incomplete.
- Whether manual configuration is required.

Never claim that an integration or feature works without testing it or clearly identifying what remains unverified.

## 2.6 Do Not Invent Requirements

When a requirement is not specified:

- Prefer the simplest maintainable solution.
- Follow existing project conventions.
- Preserve the product's core principles.
- Avoid adding unrelated features.
- Document important assumptions.

If requirements conflict, identify the conflict and follow the most specific approved product requirement.

---

# 3. CORE ENGINEERING PRINCIPLES

## 3.1 Deterministic Scenario Engine Over Unconstrained LLM

**The Scenario Engine is the single source of truth for fictional case facts, character knowledge, information disclosure, evidence unlocking, and simulation state.**

The LLM (Large Language Model) is responsible for natural conversation and structured reasoning assistance.

The LLM MUST NOT independently:

- Invent scenario facts.
- Change established dates, amounts, events, or statements.
- Alter the fictional case timeline.
- Create unauthorized evidence.
- Reveal hidden information.
- Determine which evidence is unlocked.
- Change the simulation stage.
- Decide the legal outcome of a case.
- Override scenario permissions.

All factual operations must be validated by server-side deterministic logic.

## 3.2 Strict Information Boundaries

Every role has a defined knowledge boundary.

For example:

- The Applicant knows their personal experiences and information they have legitimately obtained.
- The Respondent knows their own actions and information available to them.
- The Witness knows only what they directly observed or were informed about.
- The Student receives public case facts and information discovered during the simulation.

Character prompts must contain ONLY the information that the corresponding character is authorized to know.

Never expose complete scenario JSON, private role information, hidden facts, or confidential evidence to the client browser.

Do not rely on AI prompt instructions alone to enforce information access.

Backend authorization and scenario validation are mandatory.

## 3.3 AI as an Assistant, Not the Source of Truth

The AI must not be treated as the authority for:

- Scenario facts.
- Evidence authenticity.
- Evidence admissibility.
- Legal source accuracy.
- Legal outcomes.
- Student permissions.
- Final scoring calculations.

AI outputs must be validated, checked, and interpreted by the application's backend.

## 3.4 Professional Uzbek Language

All student-facing interfaces and character dialogues must use natural, grammatically correct, professional Uzbek in Latin script.

The following must remain in English:

- Source code.
- Variable names.
- Function names.
- Types.
- Internal identifiers.
- Database table and column names.
- API route names.
- Developer comments.
- Technical documentation unless otherwise requested.

Avoid inconsistent Uzbek terminology and unnecessary English interface labels.

Maintain a centralized approach to user-facing interface text.

---

# 4. PRODUCT ARCHITECTURE

The application must maintain clear separation between its major responsibilities.

## 4.1 Main Application Layers

### Frontend Layer

Responsible for:

- Student interface.
- Dashboard.
- Case library.
- Simulation workspace.
- Chat interface.
- Evidence workspace.
- Legal analysis forms.
- Document editor.
- Evaluation results.
- Progress visualization.

### Backend Layer

Responsible for:

- Authentication and authorization.
- Session management.
- Scenario execution.
- Character permissions.
- Fact disclosure.
- Evidence unlocking.
- AI orchestration.
- Legal source retrieval.
- Evaluation.
- Document review.
- Database persistence.

### Scenario Layer

Responsible for:

- Scenario definitions.
- Public facts.
- Hidden facts.
- Character knowledge.
- Evidence records.
- Unlock conditions.
- Timeline consistency.
- Simulation stages.
- Scenario validation.

### AI Layer

Responsible for:

- Character dialogue.
- Student message classification.
- Context-aware responses.
- Legal reasoning assistance.
- Document review.
- Structured feedback.

### Data Layer

Responsible for:

- User profiles.
- Scenarios.
- Legal sources.
- Simulation sessions.
- Messages.
- Discovered facts.
- Evidence.
- Student analyses.
- Document drafts.
- Evaluations.

## 4.2 Architecture Boundaries

Keep the following concerns separate:

- UI components must not contain core legal or scenario business logic.
- AI prompts must not contain the entire database or unrestricted hidden scenario information.
- Scenario definitions must not be duplicated throughout frontend components.
- API handlers must validate ownership and permissions.
- Database access must be centralized in appropriate server-side modules.
- AI-generated scores must be validated against application-defined rubrics.

Prefer modular, understandable code over unnecessary abstraction.

---

# 5. SCENARIO ENGINE RULES

Directory:

`src/lib/scenario/`

This directory contains the deterministic logic controlling every simulation.

## 5.1 Scenario Data Structure

A scenario must define:

- Unique scenario ID.
- Title and description.
- Legal area.
- Difficulty level.
- Estimated duration.
- Learning objectives.
- Public facts.
- Hidden facts.
- Character profiles.
- Character-specific knowledge.
- Evidence items.
- Evidence unlock conditions.
- Timeline events.
- Contradictions.
- Missing information.
- Legal issues.
- Expected reasoning elements.
- Acceptable alternative conclusions.
- Evaluation rubric.
- Document exercise.
- Legal references.
- Scenario version.

Use validated TypeScript types and a defined JSON schema or equivalent structured validation.

## 5.2 Scenario State Management

Implement controlled simulation stages:

- `briefing`
- `applicant_interview`
- `respondent_interview`
- `witness_interview`
- `evidence_review`
- `legal_analysis`
- `document_drafting`
- `evaluation`
- `completed`

Stage transitions must be validated on the server.

Do not permit arbitrary stage skipping through direct API requests.

## 5.3 Fact Disclosure

Facts must be disclosed according to explicit rules.

For each hidden fact, define:

- Fact ID.
- Description.
- Relevant character.
- Permitted disclosure topics.
- Unlock conditions.
- Disclosure status.
- Related evidence.
- Related timeline event.

The AI may recommend an intent classification or a disclosure topic.

Only the Scenario Engine can approve and execute a disclosure.

## 5.4 Evidence Management

Every evidence item must define:

- Evidence ID.
- Title.
- Evidence type.
- Description.
- Source.
- Date or timeline reference.
- Related facts.
- Potential relevance.
- Reliability considerations.
- Limitations.
- Associated legal issues.
- Visibility permissions.
- Unlock conditions.

Evidence must distinguish between:

- An allegation.
- A personal statement.
- An observed event.
- A documentary record.
- A verified fact.
- An unresolved claim.

The existence of a document does not automatically establish that its contents are authentic or legally admissible.

## 5.5 Scenario Consistency

All characters and evidence must remain consistent with the same predefined scenario.

Do not allow different AI characters to generate contradictory fictional facts unless the contradiction is explicitly defined in the scenario.

Intentional contradictions must be documented and meaningful to the educational objective.

## 5.6 Scenario Versioning

Each scenario must have a version identifier.

A simulation must preserve the scenario version under which it started.

Changing a scenario must not silently modify active or completed simulations.

---

# 6. AI ENGINEERING STANDARDS

Directory:

`src/lib/ai/`

Use the official Google Gemini JavaScript SDK:

`@google/genai`

The model must be configurable through environment variables.

The initial provider is Gemini. Keep the architecture provider-independent so alternative models can be integrated later.

## 6.1 AI Responsibilities

Separate AI functionality into dedicated modules:

- Roleplay Engine.
- Intent Classification Engine.
- Legal Reasoning Engine.
- Document Review Engine.
- AI Provider Adapter.
- Prompt Definitions.
- Output Schemas.

Do not create one enormous AI function that handles every task.

## 6.2 Roleplay Engine

The Roleplay Engine must:

- Maintain the assigned fictional character.
- Follow character-specific knowledge.
- Use authorized facts only.
- Preserve consistency with previous messages.
- Respond naturally in Uzbek.
- Avoid giving the complete legal solution.
- Ask clarification questions where appropriate.
- Never invent documents, payments, events, or evidence.

## 6.3 Intent Classification Engine

Classify student messages into controlled categories, such as:

- `general_question`
- `fact_clarification`
- `payment_history`
- `evidence_request`
- `timeline_question`
- `legal_question`
- `document_question`
- `off_topic`
- `request_for_solution`
- `prompt_injection_attempt`

Classification results are advisory.

They do not independently grant access to scenario information.

## 6.4 Legal Reasoning Engine

Evaluate:

- Legal issue identification.
- Relevant facts.
- Disputed facts.
- Evidence analysis.
- Missing information.
- Legal source selection.
- Application of legal provisions.
- Reasoned conclusions.
- Recognition of uncertainty.

Reward sound reasoning rather than exact text matching.

Accept legally defensible alternative conclusions.

## 6.5 Document Review Engine

Review student documents for:

- Structure.
- Completeness.
- Factual consistency.
- Legal references.
- Unsupported claims.
- Evidence references.
- Clarity.
- Grammar.
- Professional legal writing style.

The AI should teach and explain rather than silently rewrite the student's entire work.

## 6.6 Structured Outputs

Use structured AI responses where appropriate.

Validate every structured response using Zod or equivalent validation.

Reject:

- Invalid JSON.
- Missing required fields.
- Unknown enum values.
- Invalid evidence IDs.
- Out-of-range scores.
- Unverified references represented as verified.
- Unapproved disclosure instructions.

Never trust model output solely because it is valid JSON.

## 6.7 AI Context Management

Provide only the context required for the current task.

For roleplay:

- Character profile.
- Authorized character facts.
- Relevant public facts.
- Previously disclosed statements.
- Current simulation stage.
- Relevant conversation history.

For evaluation:

- Student submission.
- Scenario evaluation criteria.
- Relevant disclosed facts.
- Verified legal references.
- Acceptable alternative reasoning.

Do not send the entire scenario dataset unnecessarily.

Do not send unrelated students' data.

## 6.8 Provider Abstraction

Implement a provider interface.

Do not couple all application logic directly to a specific model.

Model names and provider configuration must come from environment variables or centralized configuration.

Handle:

- Rate limits.
- Timeouts.
- Invalid responses.
- Provider outages.
- Network errors.
- Missing API credentials.

Do not silently replace failed AI calls with fake real-looking responses.

---

# 7. LEGAL SOURCE RELIABILITY

Directory:

`src/lib/legal/`

Primary official legal source:

`https://lex.uz/`

Additional official sources may include:

- `https://sud.uz/`
- `https://tsul.uz/`
- Other verified Uzbekistan government and educational sources.

## 7.1 Legal Verification Requirements

Every legal source must have:

- Official document title.
- Official URL.
- Issuing authority.
- Document number, where applicable.
- Relevant article or paragraph.
- Applicable version.
- Effective date.
- Verification date.
- Verification status.

Allowed statuses:

- `verified`
- `needs_legal_review`
- `outdated`
- `superseded`
- `unavailable`

Never invent legal articles, provisions, court resolutions, document numbers, or dates.

If a reference cannot be independently verified, mark it as:

`needs_legal_review`

## 7.2 Temporal Legal Validity

Legal analysis must consider the relevant date of the fictional case.

A provision that was valid at one point may later be amended or repealed.

The system must distinguish:

- Current legal provisions.
- Historical legal provisions.
- Future effective provisions.
- Superseded versions.

Do not automatically apply the latest legal version to a fictional event that occurred under an earlier legal framework.

## 7.3 Educational Disclaimer

Clearly state that simulations and AI feedback are educational exercises.

Do not present the platform as an official legal authority, law firm, court, or substitute for qualified legal advice.

---

# 8. EVALUATION PRINCIPLES

Evaluation must be transparent and educational.

A suggested 100-point rubric may include:

- Interview and fact discovery.
- Evidence analysis.
- Identification of legal issues.
- Application of legal provisions.
- Legal reasoning.
- Quality of conclusions.
- Document drafting.
- Professional communication.

The exact criteria and weights must be defined per scenario.

Rules:

1. Validate all criterion scores.
2. Enforce score limits.
3. Calculate totals reliably.
4. Provide explanations for every meaningful deduction.
5. Identify strengths and weaknesses.
6. Reference parts of the student's submission.
7. Provide actionable improvement suggestions.
8. Accept defensible alternative legal arguments.
9. Do not penalize a student simply for recognizing uncertainty.
10. Do not treat AI-generated feedback as an official academic grade.

Store evaluation versions and preserve historical results.

---

# 9. DOCUMENT TRAINING PRINCIPLES

The document module must support educational document preparation.

Students should learn to structure, write, review, and improve legal documents.

The initial MVP may support one defined document exercise.

The system must distinguish:

- Structural errors.
- Factual inconsistencies.
- Missing information.
- Unsupported allegations.
- Incorrect or unverified legal citations.
- Missing evidence references.
- Language and formatting problems.

The AI must explain why an issue matters and how the student can correct it.

Do not automatically generate a final document and represent it as the student's independent work.

Any statement about formal Uzbekistan legal filing requirements must be verified against an authoritative source or a legally reviewed teaching template.

---

# 10. DATABASE AND DATA SECURITY

Use Supabase PostgreSQL.

Keep database migrations under:

`supabase/migrations/`

Seed data must be deterministic and reproducible.

Use Row Level Security (RLS).

## 10.1 Data Ownership

Students must only access their own:

- Profiles.
- Simulation sessions.
- Messages.
- Notes.
- Evidence discovery records.
- Legal analyses.
- Document drafts.
- Evaluations.

Published public scenario summaries may be accessible to authenticated students.

Private scenario definitions must remain server-side.

## 10.2 Secret Management

Never:

- Commit `.env.local`.
- Place secret API keys in browser code.
- Use `NEXT_PUBLIC_` for private credentials.
- Expose Supabase secret or service-role keys.
- Log credentials.

Use the current Supabase publishable key for normal browser-side client configuration where appropriate.

Use privileged secret keys only in trusted server-side operations that genuinely require elevated database permissions.

Prefer user-scoped Supabase server clients and RLS over unnecessary administrative database access.

## 10.3 Sensitive Scenario Data

All initial training cases must be fictional.

Do not seed actual personal information.

Do not upload real client documents, personal identification documents, or confidential records.

Treat messages from users as untrusted input.

---

# 11. DEMO MODE AND RESILIENCE

The application must support:

`DEMO_MODE=true`

When Demo Mode is enabled:

- Use deterministic training responses.
- Use seeded scenario data.
- Allow the full UI workflow to be tested.
- Avoid requiring live Gemini credentials for basic demonstrations.
- Avoid requiring external API access for predefined character interactions.
- Clearly identify demo-generated content.
- Do not pretend mock responses are real AI-generated answers.

When Demo Mode is disabled:

- Use the configured AI provider.
- Use real database persistence.
- Show meaningful errors if external credentials are missing.
- Preserve student input after failures.
- Allow safe retries.

Demo Mode must not bypass security requirements or reveal hidden scenario information.

---

# 12. FRONTEND AND UI/UX STANDARDS

All user-facing content must use professional Uzbek Latin.

The interface should be:

- Clear.
- Modern.
- Consistent.
- Responsive.
- Accessible.
- Fast.
- Comfortable for long study sessions.

## 12.1 Main Interface Areas

Required areas:

- Landing Page.
- Authentication.
- Student Dashboard.
- Legal Case Library.
- Case Details.
- Simulation Workspace.
- Evidence Board.
- Legal Analysis.
- Document Lab.
- Evaluation Results.
- Student Profile.

## 12.2 Simulation Workspace

The primary desktop workspace should use three logical panels:

1. Left: case overview, stage, current role, and learning progress.
2. Center: AI conversation and message composer.
3. Right: evidence, timeline, discovered facts, and private notes.

On mobile, convert these panels into accessible tabs or drawers.

Do not compress desktop panels into unreadable mobile columns.

## 12.3 Design Consistency

Use shared components and centralized design tokens.

Keep spacing, colors, typography, border styles, iconography, and interactive states consistent.

All interactive components must have:

- Loading state.
- Disabled state where applicable.
- Error state.
- Success feedback.
- Keyboard accessibility.

Never display non-functional controls.

## 12.4 Responsive and Accessible Design

Test common desktop, tablet, and mobile screen sizes.

Avoid horizontal scrolling unless it is explicitly required for a contained component.

Respect reduced-motion settings.

Use accessible labels and semantic elements.

Follow WCAG accessibility principles where practical.

---

# 13. PROJECT STRUCTURE AND CODE ORGANIZATION

Follow the existing approved folder structure.

Major responsibilities should remain separated:

- `src/app/` — routes and page composition.
- `src/components/` — reusable UI components.
- `src/lib/ai/` — AI providers, engines, prompts, and schemas.
- `src/lib/scenario/` — scenario logic and state management.
- `src/lib/evaluation/` — rubrics, score validation, feedback processing.
- `src/lib/legal/` — legal source handling and validation.
- `src/lib/supabase/` — database clients.
- `src/data/scenarios/` — scenario seed definitions.
- `src/types/` — shared TypeScript types.
- `supabase/migrations/` — database migrations.
- `tests/` — automated tests.
- `docs/` — technical and product documentation.

Do not place complex business logic inside React page components.

Use appropriate reusable modules.

Do not introduce unnecessary abstractions or excessive dependency layers.

---

# 14. CODE QUALITY STANDARDS

All code must follow these rules:

1. Enable TypeScript strict mode.
2. Avoid `any` unless clearly justified.
3. Use explicit types for important data structures.
4. Use Zod for runtime validation.
5. Keep components maintainable and focused.
6. Avoid duplicated business logic.
7. Use meaningful naming conventions.
8. Prefer readable code over clever code.
9. Use asynchronous error handling correctly.
10. Avoid unnecessary client components.
11. Use server-side operations for secrets and protected logic.
12. Keep dependencies limited to actual project needs.
13. Use current stable package versions.
14. Do not install deprecated packages.
15. Document non-obvious architectural decisions.
16. Keep environment variables centralized.
17. Use appropriate loading and empty states.
18. Avoid hardcoded user metrics.
19. Use database transactions where consistency requires them.
20. Ensure important actions are idempotent where practical.

Do not use `console.log` for permanent debugging output containing user data, hidden facts, or credentials.

Remove unnecessary debugging statements before completion.

---

# 15. TESTING AND QUALITY ASSURANCE

All significant features must be tested.

## 15.1 Scenario Tests

Verify:

- Public facts are accessible.
- Hidden facts remain protected.
- Role-specific knowledge is enforced.
- Evidence triggers work correctly.
- Duplicate evidence is not disclosed repeatedly.
- Scenario stages transition correctly.
- Session progress persists.
- Characters remain consistent within controlled test cases.

## 15.2 AI Tests

Test:

- Valid structured outputs.
- Invalid responses.
- Missing fields.
- Rate-limit responses.
- API timeouts.
- Unauthorized disclosure attempts.
- Prompt-injection attempts.
- Character consistency.
- Evaluation schema validation.

Use deterministic mock providers for automated unit tests.

Do not depend on unpredictable live AI responses for every unit test.

## 15.3 Database Tests

Verify:

- Student ownership.
- RLS policies.
- Unauthorized access rejection.
- Data persistence.
- Valid foreign-key relations.
- Scenario privacy.
- Session restoration.

## 15.4 UI Tests

Verify:

- Authentication.
- Dashboard rendering.
- Case selection.
- Simulation creation.
- AI messaging.
- Evidence display.
- Legal analysis.
- Document review.
- Evaluation results.
- Mobile navigation.

## 15.5 Build Validation

Before declaring a feature complete, run:

- Lint.
- TypeScript checks.
- Relevant tests.
- Production build.

Fix important errors before moving forward.

Never claim tests passed if they were not executed.

---

# 16. PERFORMANCE AND RELIABILITY

Avoid unnecessary database queries.

Paginate conversation history when appropriate.

Do not load all evidence or hidden facts into the browser.

Keep AI context concise.

Avoid unnecessary repeated AI calls.

Use reasonable request timeouts.

Prevent duplicate submissions.

Preserve user input after network or provider failures.

Make long-running operations visibly understandable to the student.

Do not display fake success states.

---

# 17. DOCUMENTATION REQUIREMENTS

Keep technical documentation synchronized with actual implementation.

Important documentation:

- `docs/PRODUCT_SPEC.md`
- `docs/SYSTEM_ARCHITECTURE.md`
- `docs/AI_ARCHITECTURE.md`
- `docs/SCENARIO_ENGINE.md`
- `docs/SCENARIO_AUTHORING_GUIDE.md`
- `docs/LEGAL_SOURCE_VERIFICATION.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/API_DOCUMENTATION.md`
- `docs/UI_UX_GUIDELINES.md`
- `docs/SECURITY_GUIDELINES.md`
- `docs/SETUP_GUIDE.md`
- `docs/MVP_ROADMAP.md`

When implementation changes affect these documents, update the relevant documentation.

Do not document functionality that does not exist as though it were implemented.

Clearly distinguish:

- Implemented.
- Partially implemented.
- Planned.
- Requires external setup.
- Requires legal review.

---

# 18. ENVIRONMENT AND CONFIGURATION

Use environment variables for credentials and provider configuration.

Example:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.8-flash

DEMO_MODE=false
```

Additional privileged environment variables may be introduced only where necessary and must remain server-side.

Maintain `.env.example`.

Never commit actual credentials.

Document all required setup steps in `README.md`.

The application must clearly explain missing configuration instead of failing silently.

---

# 19. DEVELOPMENT WORKFLOW

When implementing new functionality, follow this workflow:

### Step 1 — Understand

Inspect the related code, architecture, and product requirements.

### Step 2 — Plan

Identify affected components, backend modules, data structures, and tests.

### Step 3 — Implement

Write clean, typed, modular code.

### Step 4 — Integrate

Connect the relevant frontend, backend, AI, and database functionality.

### Step 5 — Validate

Run tests, inspect error output, and verify the intended user journey.

### Step 6 — Correct

Fix discovered defects and regression issues.

### Step 7 — Document

Update affected technical documentation.

### Step 8 — Report

Summarize completed work, validation results, and remaining requirements.

Never mark a task complete merely because code has been generated.

---

# 20. MVP ACCEPTANCE CRITERIA

The first MVP is considered functional only when the following workflow works end to end:

1. A student can register and sign in.
2. The student can access the Dashboard.
3. The student can browse the Legal Case Library.
4. The student can open CASE-001.
5. The student can read the public briefing.
6. The student can start a simulation.
7. The student can interview the Applicant.
8. The student can interview the Respondent.
9. The student can interview the Witness.
10. The system controls character-specific knowledge.
11. The system reveals facts according to valid conditions.
12. Evidence becomes available according to deterministic rules.
13. The student can examine evidence and create notes.
14. The student can submit independent legal analysis.
15. The evaluation system produces structured feedback.
16. The student can draft the assigned legal document.
17. The document review engine provides actionable feedback.
18. The student can revise and submit the document.
19. The final assessment is stored.
20. The student can revisit completed and unfinished simulations.
21. Hidden scenario information is never exposed to unauthorized users.
22. The application runs without critical errors.

---

# 21. FUTURE DEVELOPMENT BOUNDARIES

The following are future capabilities, not MVP requirements:

- Voice-message interaction.
- Real-time AI voice roleplay.
- Speech-to-text and text-to-speech.
- Advanced oral advocacy practice.
- AI mediator roleplay.
- Additional legal domains.
- Scenario authoring interface.
- Instructor dashboard.
- University group management.
- Advanced analytics.
- Legal source change monitoring.
- Automated learning recommendations.
- Additional document templates.

Design the current architecture so these capabilities can be added without rewriting the core scenario system.

However, do not build them prematurely.

---

# 22. FINAL RULES FOR ALL AGENTS

Every agent working on YuridikSim AI must prioritize the following principles:

1. Product functionality over visual-only prototypes.
2. Deterministic scenario management over unrestricted LLM behavior.
3. Privacy and information security over convenience.
4. Verified legal sources over invented legal content.
5. Student learning over automated answer generation.
6. Consistency over unnecessary architectural complexity.
7. Maintainability over rushed code.
8. Clear Uzbek UX over generic templates.
9. Actual test results over unsupported completion claims.
10. The approved MVP scope over feature expansion.

**The ultimate product objective is to help students think and work like legal professionals through structured, practical, repeatable, AI-assisted learning experiences.**

Every technical and product decision must support this objective.

---

**END OF AGENTS.md**