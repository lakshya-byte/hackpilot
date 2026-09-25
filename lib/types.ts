export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
}

// Mirrors hackpilot-backend/internal/dto.ProfileResponse
export interface Profile {
  id: string;
  name: string;
  username: string;
  email: string;
  is_verified: boolean;
  avatar_url?: string;
  bio?: string;
  location?: string;
  institution?: string;
  degree?: string;
  graduation_year?: number;
  experience_label?: string;
  resume_url?: string;
  socials: SocialLinks;
  primary_specialization?: string;
  domain_capabilities?: string[];
  tech_stack?: string[];
  created_at: string;
}

// Mirrors hackpilot-backend/internal/dto.UpdateProfileRequest — all optional.
export interface UpdateProfileInput {
  username?: string;
  bio?: string;
  location?: string;
  institution?: string;
  degree?: string;
  graduation_year?: number;
  experience_label?: string;
  resume_url?: string;
  socials?: SocialLinks;
  primary_specialization?: string;
  domain_capabilities?: string[];
  tech_stack?: string[];
}

// Mirrors hackpilot-backend/internal/dto.TeamMemberResponse
export interface TeamMember {
  user_id: string;
  name: string;
  username?: string;
  photo_url?: string;
  primary_skill?: string;
  role: "lead" | "member";
  status: "invited" | "active" | "declined";
}

// Mirrors hackpilot-backend/internal/dto.TeamResponse
export interface Team {
  id: string;
  name: string;
  hackathon: string;
  lead_id: string;
  members: TeamMember[];
  created_at: string;
}

// Mirrors hackpilot-backend/internal/dto.GenerateIdeasRequest
export interface GenerateIdeasInput {
  hackathon_type: string;
  duration: string;
  target_audience: string;
  problem_statement?: string;
}

// Mirrors hackpilot-backend/internal/dto.IdeaResultResponse
export interface IdeaResult {
  title: string;
  description: string;
  tech_stack: string[];
  feasibility_score: number;
  impact_score: number;
  novelty_score: number;
  skill_fit_score: number;
  judging_angle: string;
  shortlisted: boolean;
}

// Mirrors hackpilot-backend/internal/dto.GeneratedIdeaResponse
export interface GeneratedIdeaSet {
  id: string;
  team_id: string;
  hackathon_type: string;
  duration: string;
  target_audience: string;
  problem_statement?: string;
  ideas: IdeaResult[];
  created_at: string;
}

// Mirrors hackpilot-backend/internal/dto.IdeaHistoryResponse
export interface IdeaHistory {
  generations: GeneratedIdeaSet[];
}

// Mirrors hackpilot-backend/internal/dto.ResearchIdeaRequest
export interface ResearchIdeaInput {
  idea_title: string;
  idea_description: string;
  hackathon_type: string;
  target_audience: string;
}

// Mirrors hackpilot-backend/internal/dto.ExistingSolutionResponse
export interface ExistingSolution {
  name: string;
  type: string;
  url: string;
  summary: string;
}

// Mirrors hackpilot-backend/internal/dto.FailedAttemptResponse
export interface FailedAttempt {
  name: string;
  reason: string;
}

// Mirrors hackpilot-backend/internal/dto.MarketAngleResponse
export interface MarketAngle {
  target_segment: string;
  problem_scale: string;
  urgency: string;
}

// Mirrors hackpilot-backend/internal/dto.ResearchResultResponse
export interface ResearchResultSet {
  id: string;
  team_id: string;
  idea_title: string;
  idea_description: string;
  existing_solutions: ExistingSolution[];
  failed_attempts: FailedAttempt[];
  market_gap: string;
  market_angle: MarketAngle;
  differentiation_one_liner: string;
  judge_positioning: string;
  overall_viability_score: number;
  created_at: string;
}

// Mirrors hackpilot-backend/internal/dto.ResearchHistoryResponse
export interface ResearchHistory {
  researches: ResearchResultSet[];
}

// Mirrors hackpilot-backend/internal/dto.ChecklistItemResponse
export interface ChecklistItem {
  item_id: string;
  text: string;
  checked: boolean;
  updated_at: string;
}

// Mirrors hackpilot-backend/internal/dto.PhaseResponse
export interface ChecklistPhase {
  phase_id: string;
  label: string;
  items: ChecklistItem[];
  progress: number;
}

// Mirrors hackpilot-backend/internal/dto.ChecklistResponse
export interface Checklist {
  id: string;
  team_id: string;
  hackathon_id: string;
  phases: ChecklistPhase[];
  progress: number;
  created_at: string;
  updated_at: string;
}

// Mirrors hackpilot-backend/internal/dto.FrameworkPhaseResponse
export interface FrameworkPhase {
  phase_id: string;
  name: string;
  percentage: number;
  description: string;
  tasks: string[];
  start_time: string;
  end_time: string;
}

// Mirrors hackpilot-backend/internal/dto.WinFrameworkResponse
export interface WinFramework {
  id: string;
  team_id: string;
  hackathon_name: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  phases: FrameworkPhase[];
  created_at: string;
}

// Mirrors hackpilot-backend/internal/dto.CreateFrameworkRequest
export interface CreateFrameworkInput {
  hackathon_name: string;
  start_time: string;
  duration_hours: number;
}

// Mirrors hackpilot-backend/internal/dto.RubricCriterionInput
export interface RubricCriterion {
  criterion: string;
  weight: number;
  description: string;
}

// Mirrors hackpilot-backend/internal/dto.GeneratePitchRequest
export interface GeneratePitchInput {
  idea_title: string;
  idea_description: string;
  hackathon_type: string;
  target_audience: string;
  rubric_criteria: RubricCriterion[];
  market_gap?: string;
  differentiation_one_liner?: string;
}

// Mirrors hackpilot-backend/internal/dto.SlideOutlineResponse
export interface SlideOutline {
  slide_number: number;
  title: string;
  content: string;
  talking_points: string[];
  demo_moment?: string;
  rubric_criteria_addressed: string[];
  time_allocation_seconds: number;
}

// Mirrors hackpilot-backend/internal/dto.RubricCoverageResponse
export interface RubricCoverage {
  criterion: string;
  weight: number;
  addressed_in_slides: number[];
  coverage_strength: string;
}

// Mirrors hackpilot-backend/internal/dto.PitchResultResponse
export interface PitchResultSet {
  id: string;
  team_id: string;
  idea_title: string;
  hackathon_type: string;
  pitch_outline: SlideOutline[];
  total_duration_seconds: number;
  opening_hook: string;
  closing_line: string;
  demo_flow: string[];
  rubric_coverage: RubricCoverage[];
  created_at: string;
}

// Mirrors hackpilot-backend/internal/dto.PitchHistoryResponse
export interface PitchHistory {
  pitches: PitchResultSet[];
}

// Mirrors hackpilot-backend/internal/dto.ParsedRubricResponse
export interface ParsedRubric {
  rubric_criteria: RubricCriterion[];
}

// Mirrors hackpilot-backend/internal/dto.CreateOrderResponse
export interface CreateOrderResult {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

// Mirrors hackpilot-backend/internal/dto.BillingStatusResponse
export interface BillingStatus {
  plan: "free" | "pro";
  expires_at?: string;
  days_remaining: number;
  idea_generations_used_this_month: number;
  idea_generations_limit: number;
}

// Mirrors hackpilot-backend/internal/dto.PaymentRecordResponse
export interface PaymentRecord {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  amount: number;
  currency: string;
  status: "created" | "captured" | "failed";
  plan: string;
  duration_days: number;
  created_at: string;
}

// Mirrors hackpilot-backend/internal/dto.PaymentHistoryResponse
export interface PaymentHistoryResult {
  payments: PaymentRecord[];
}
