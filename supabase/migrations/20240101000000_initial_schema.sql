-- LegalIntern — Initial Database Schema with Row Level Security (RLS)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Scenarios Table (Public published info only)
CREATE TABLE IF NOT EXISTS public.scenarios (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_uz TEXT NOT NULL,
  legal_area TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  estimated_duration_minutes INT NOT NULL DEFAULT 45,
  learning_objectives_uz JSONB NOT NULL DEFAULT '[]'::jsonb,
  public_brief_uz JSONB NOT NULL DEFAULT '{}'::jsonb,
  scenario_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Confidential facts: only server-side service role should access
  version INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read published scenarios"
  ON public.scenarios FOR SELECT
  TO authenticated
  USING (status = 'published');

-- 3. Legal Sources Table
CREATE TABLE IF NOT EXISTS public.legal_sources (
  id TEXT PRIMARY KEY,
  scenario_id TEXT REFERENCES public.scenarios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  official_url TEXT NOT NULL,
  authority TEXT NOT NULL,
  article_reference TEXT NOT NULL,
  effective_date TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'needs_legal_review')),
  summary_uz TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.legal_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read legal sources"
  ON public.legal_sources FOR SELECT
  TO authenticated
  USING (true);

-- 4. Simulation Sessions Table
CREATE TABLE IF NOT EXISTS public.simulation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  scenario_version INT NOT NULL DEFAULT 1,
  current_stage TEXT NOT NULL DEFAULT 'briefing',
  current_character_role TEXT NOT NULL DEFAULT 'applicant',
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.simulation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own simulation sessions"
  ON public.simulation_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_user_scenario ON public.simulation_sessions(user_id, scenario_id);

-- 5. Simulation Messages Table
CREATE TABLE IF NOT EXISTS public.simulation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.simulation_sessions(id) ON DELETE CASCADE,
  character_role TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('student', 'character', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.simulation_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from their sessions"
  ON public.simulation_messages FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.simulation_sessions s
    WHERE s.id = simulation_messages.session_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert messages into their sessions"
  ON public.simulation_messages FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.simulation_sessions s
    WHERE s.id = simulation_messages.session_id AND s.user_id = auth.uid()
  ));

CREATE INDEX IF NOT EXISTS idx_messages_session ON public.simulation_messages(session_id, created_at ASC);

-- 6. Unlocked Facts Table
CREATE TABLE IF NOT EXISTS public.unlocked_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.simulation_sessions(id) ON DELETE CASCADE,
  fact_id TEXT NOT NULL,
  disclosed_to_role TEXT NOT NULL,
  disclosed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (session_id, fact_id)
);

ALTER TABLE public.unlocked_facts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their unlocked facts"
  ON public.unlocked_facts FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.simulation_sessions s
    WHERE s.id = unlocked_facts.session_id AND s.user_id = auth.uid()
  ));

-- 7. Unlocked Evidence Table
CREATE TABLE IF NOT EXISTS public.unlocked_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.simulation_sessions(id) ON DELETE CASCADE,
  evidence_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (session_id, evidence_id)
);

ALTER TABLE public.unlocked_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their unlocked evidence"
  ON public.unlocked_evidence FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.simulation_sessions s
    WHERE s.id = unlocked_evidence.session_id AND s.user_id = auth.uid()
  ));

-- 8. Student Notes Table
CREATE TABLE IF NOT EXISTS public.student_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.simulation_sessions(id) ON DELETE CASCADE UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their student notes"
  ON public.student_notes FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.simulation_sessions s
    WHERE s.id = student_notes.session_id AND s.user_id = auth.uid()
  ));

-- 9. Analysis Submissions Table
CREATE TABLE IF NOT EXISTS public.analysis_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.simulation_sessions(id) ON DELETE CASCADE,
  submission_data JSONB NOT NULL,
  version INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.analysis_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their analysis submissions"
  ON public.analysis_submissions FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.simulation_sessions s
    WHERE s.id = analysis_submissions.session_id AND s.user_id = auth.uid()
  ));

-- 10. Evaluations Table
CREATE TABLE IF NOT EXISTS public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.simulation_sessions(id) ON DELETE CASCADE,
  overall_score INT NOT NULL,
  criteria_scores JSONB NOT NULL,
  feedback JSONB NOT NULL,
  evaluation_version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view evaluations of their sessions"
  ON public.evaluations FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.simulation_sessions s
    WHERE s.id = evaluations.session_id AND s.user_id = auth.uid()
  ));

-- 11. Document Drafts Table
CREATE TABLE IF NOT EXISTS public.document_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.simulation_sessions(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  sections JSONB NOT NULL DEFAULT '{}'::jsonb,
  review_result JSONB,
  version INT NOT NULL DEFAULT 1,
  is_submitted BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.document_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their document drafts"
  ON public.document_drafts FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.simulation_sessions s
    WHERE s.id = document_drafts.session_id AND s.user_id = auth.uid()
  ));
