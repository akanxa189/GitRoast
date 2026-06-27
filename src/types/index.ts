export type RoastIntensity = 1 | 2 | 3;

export interface GitHubData {
  name: string;
  username: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
  total_stars: number;
  most_used_languages: string[];
  last_push_date: string | null;
  has_profile_pic: boolean;
  readme_count: number;
  repo_names: string[];
  top_repo: {
    name: string;
    stars: number;
    language: string | null;
  } | null;
  avatar_url: string;
}

export interface RoastScores {
  codeQuality: number;
  commitConsistency: number;
  documentationScore: number;
  creativityScore: number;
  overallRoastScore: number;
}

export interface RoastResponse {
  roast: string;
  scores: RoastScores;
  verdict: string;
}

export interface RoastResult {
  githubData: GitHubData;
  roast: string;
  scores: RoastScores;
  verdict: string;
}

export interface RoastHistory {
  username: string;
  avatar: string;
  roast: string;
  intensity: number;
  date: string;
  stats: {
    repos: number;
    stars: number;
    followers: number;
    topLanguage: string;
  };
}

export type RoastErrorType =
  | 'not_found'
  | 'rate_limit'
  | 'groq_error'
  | 'network'
  | 'unknown';

export interface RoastError {
  type: RoastErrorType;
  message: string;
}

export type VoteChoice = 'self' | 'friend' | null;
