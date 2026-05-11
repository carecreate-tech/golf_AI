export type MissTendency = "slice" | "hook" | "topped" | "fat" | "none";

export interface Club {
  id: string;
  name: string;
  distance: number;
  loft?: number | null;
  miss_tendency?: MissTendency | null;
  memo?: string | null;
  created_at: string;
}

export interface ClubInput {
  name: string;
  distance: number;
  loft?: number | null;
  miss_tendency?: MissTendency | null;
  memo?: string | null;
}

export interface DistanceGap {
  from: Club;
  to: Club;
  gap: number;
  type: "gap" | "overlap";
}

export interface AnalysisResult {
  gaps: DistanceGap[];
  overlaps: DistanceGap[];
  aiReport: string;
  loading: boolean;
  error?: string;
}
