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
