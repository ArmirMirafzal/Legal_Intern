# Scenario Authoring Guide — YuridikSim AI

This guide explains how legal educators and developers can author new scenarios for YuridikSim AI.

## 1. JSON Schema Structure
Scenarios are located under `src/data/scenarios/` as JSON files conforming to the `ScenarioData` interface:

```json
{
  "id": "CASE-XXX",
  "slug": "url-friendly-slug",
  "titleUz": "Kazus nomi",
  "legalArea": "family_law | labour_law | civil_law | consumer_protection",
  "legalAreaUz": "Soha nomi",
  "difficulty": "boshlangich | orta | murakkab",
  "difficultyUz": "O'rta",
  "estimatedDurationMinutes": 45,
  "learningObjectivesUz": ["..."],
  "publicBriefUz": {
    "summary": "...",
    "background": "...",
    "parties": [...],
    "studentMission": "..."
  },
  "characters": [...],
  "facts": [...],
  "evidence": [...],
  "contradictions": [...],
  "missingInfo": [...],
  "legalSources": [...],
  "rubric": [...],
  "documentTask": {...}
}
```

## 2. Best Practices for Scenario Design
1. **Neutral Persona Framing:** Avoid declaring parties as "offenders" or "criminals" at the start.
2. **Intentional Contradictions:** Include controlled factual inconsistencies between oral testimony and documentary proof.
3. **Verified Lex.uz References:** Every legal citation must reference real legislation with official URLs.
4. **Synthetic Data Hygiene:** Do not use real identity numbers, phone numbers, or actual client details.
