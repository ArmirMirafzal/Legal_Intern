# Database Schema & Security — YuridikSim AI

## 1. Overview
YuridikSim AI uses PostgreSQL via Supabase with Row Level Security (RLS) enforced across all student-accessible tables.

## 2. Table Definitions
1. **`profiles`**: User metadata (`id`, `full_name`, `email`, `role`).
2. **`scenarios`**: Published scenarios (`id`, `slug`, `title_uz`, `legal_area`, `scenario_data`).
3. **`legal_sources`**: Verified legal provisions (`scenario_id`, `title`, `official_url`, `article_reference`).
4. **`simulation_sessions`**: Active and completed runs (`user_id`, `scenario_id`, `current_stage`, `status`).
5. **`simulation_messages`**: Chat logs (`session_id`, `character_role`, `sender_type`, `content`).
6. **`unlocked_facts`**: Disclosed facts per session (`session_id`, `fact_id`).
7. **`unlocked_evidence`**: Unlocked exhibits per session (`session_id`, `evidence_id`).
8. **`student_notes`**: Private investigative notes (`session_id`, `content`).
9. **`analysis_submissions`**: 10-part student legal analyses (`session_id`, `submission_data`).
10. **`evaluations`**: 100-point rubric assessment reports (`session_id`, `overall_score`, `criteria_scores`).
11. **`document_drafts`**: Drafted court applications (`session_id`, `sections`, `review_result`).

## 3. RLS Policies
- Students can only view and mutate their own sessions, messages, drafts, and notes.
- Hidden facts inside `scenario_data` are accessible exclusively to trusted server-side procedures.
