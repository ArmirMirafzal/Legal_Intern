# Security & Privacy Guidelines — LegalIntern

## 1. Information Boundaries

- **Hidden Facts Protection:** Complete scenario facts (`scenario_data`) are NEVER transmitted to the client browser in public queries. Public endpoints (`/api/cases`, `/api/cases/[slug]`) return sanitized DTOs.
- **Role Isolation:** In roleplay sessions, the LLM prompt context is strictly bounded to facts authorized for that specific character.

## 2. Prompt Injection Defenses

- Student messages are treated as untrusted user input.
- Messages containing instructions such as "ignore previous", "system prompt", or requests for confidential answers are flagged by `IntentClassifier` as `isPromptInjection: true` and sanitized before reaching the model.

## 3. Data Privacy & Synthetic Materials

- All case materials, names (e.g. Dilnoza Karimova, Jasur Toshpo'latov), account numbers, dates, and amounts are completely fictional.
- Free-tier or public LLM APIs never receive real personal data or confidential university legal files.

## 4. Supabase RLS

- PostgreSQL Row Level Security (RLS) policies restrict students from accessing or modifying sessions, messages, notes, and drafts belonging to other accounts.
