// Core Types for LegalIntern

export type LegalArea =
	| "family_law"
	| "labour_law"
	| "civil_law"
	| "consumer_protection"
	| "administrative_law";

export type DifficultyLevel = "boshlangich" | "orta" | "murakkab";

export type SimulationStage =
	| "briefing"
	| "applicant_interview"
	| "respondent_interview"
	| "witness_interview"
	| "evidence_review"
	| "legal_analysis"
	| "document_drafting"
	| "evaluation"
	| "completed";

export type CharacterRole = "applicant" | "respondent" | "witness";

export interface CharacterProfile {
	role: CharacterRole;
	name: string;
	uzbekTitle: string;
	personality: string;
	relationToCase: string;
	initialMessage: string;
	avatarUrl?: string;
	authorizedFactIds: string[];
}

export interface ScenarioFact {
	id: string;
	isPublic: boolean;
	authorizedRoles: CharacterRole[];
	topic: string;
	titleUz: string;
	descriptionUz: string;
	revealsContradiction?: string;
	unlocksEvidenceId?: string;
}

export interface EvidenceItem {
	id: string; // e.g. EVD-001
	titleUz: string;
	typeUz: string;
	descriptionUz: string;
	submittedByUz: string;
	dateOrTimelineUz: string;
	contentUz: string;
	reliabilityConsiderationsUz: string;
	whatItMayEstablishUz: string;
	whatItDoesNotEstablishUz: string;
	relatedLegalIssueUz: string;
	unlockCondition: {
		requiredFactId?: string;
		requiredTopic?: string;
		requiredRole?: CharacterRole;
		autoUnlockAtStage?: SimulationStage;
	};
}

export interface LegalSourceItem {
	id: string;
	title: string;
	officialUrl: string;
	authority: string;
	articleReference: string;
	effectiveDate: string;
	verificationStatus: "verified" | "needs_legal_review";
	summaryUz: string;
}

export interface CaseContradiction {
	id: string;
	titleUz: string;
	descriptionUz: string;
	partyAStatement: string;
	partyBStatement: string;
	evidenceReference?: string;
}

export interface CaseMissingInfo {
	id: string;
	titleUz: string;
	descriptionUz: string;
	whyItMattersUz: string;
}

export interface EvaluationCriterionDef {
	key: string;
	titleUz: string;
	maxScore: number;
	descriptionUz: string;
}

export interface ScenarioData {
	id: string;
	slug: string;
	titleUz: string;
	legalArea: LegalArea;
	legalAreaUz: string;
	difficulty: DifficultyLevel;
	difficultyUz: string;
	estimatedDurationMinutes: number;
	learningObjectivesUz: string[];
	publicBriefUz: {
		summary: string;
		background: string;
		parties: { role: string; description: string }[];
		studentMission: string;
	};
	characters: CharacterProfile[];
	facts: ScenarioFact[];
	evidence: EvidenceItem[];
	contradictions: CaseContradiction[];
	missingInfo: CaseMissingInfo[];
	legalSources: LegalSourceItem[];
	rubric: EvaluationCriterionDef[];
	documentTask: {
		titleUz: string;
		instructionsUz: string;
		documentType: string;
		requiredSections: { key: string; labelUz: string; placeholderUz: string; guidanceUz: string }[];
	};
}

export interface SimulationMessage {
	id: string;
	sessionId: string;
	characterRole: CharacterRole;
	senderType: "student" | "character" | "system";
	content: string;
	metadata?: {
		intent?: string;
		detectedTopic?: string;
		unlockedFactIds?: string[];
		unlockedEvidenceIds?: string[];
	};
	createdAt: string;
}

export interface StudentAnalysisSubmission {
	id?: string;
	sessionId: string;
	mainLegalIssue: string;
	establishedFacts: string;
	disputedFacts: string;
	relevantEvidence: string;
	evidenceReliabilityConcerns: string;
	missingEvidence: string;
	applicableLegalProvisions: string;
	legalReasoning: string;
	provisionalConclusion: string;
	recommendedNextSteps: string;
	submittedAt?: string;
	status: "draft" | "submitted";
}

export interface EvaluationResult {
	id?: string;
	sessionId: string;
	overallScore: number;
	criteriaScores: {
		criterionKey: string;
		criterionTitleUz: string;
		score: number;
		maxScore: number;
		feedbackUz: string;
	}[];
	strengthsUz: string[];
	weaknessesUz: string[];
	missingIssuesUz: string[];
	legalReferenceRecommendationsUz: string[];
	nextLearningStepsUz: string[];
	evaluatedAt: string;
	isDemoSimulation?: boolean;
}

export interface DocumentIssue {
	id: string;
	sectionKey: string;
	severity: "error" | "warning" | "suggestion";
	titleUz: string;
	explanationUz: string;
	suggestedImprovementUz: string;
}

export interface DocumentReviewResult {
	overallScore: number;
	summaryFeedbackUz: string;
	issues: DocumentIssue[];
	strengthsUz: string[];
	legalDisclaimerUz: string;
}

export interface DocumentDraftSubmission {
	id?: string;
	sessionId: string;
	sections: Record<string, string>;
	reviewResult?: DocumentReviewResult;
	updatedAt: string;
	isSubmitted: boolean;
}

export interface SimulationSessionState {
	id: string;
	scenarioId: string;
	userId: string;
	currentStage: SimulationStage;
	currentCharacterRole: CharacterRole;
	unlockedFactIds: string[];
	unlockedEvidenceIds: string[];
	studentNotes: string;
	startedAt: string;
	lastActivityAt: string;
	completedAt?: string;
	status: "in_progress" | "completed";
}
