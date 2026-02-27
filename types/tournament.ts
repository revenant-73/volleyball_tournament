export interface Team {
  id: string;
  name: string;
  pool?: number;
}

export interface PoolMatch {
  id: string;
  team1Id: string;
  team2Id: string;
  team1Sets: number | null;
  team2Sets: number | null;
  completed: boolean;
  poolId: number;
}

export interface PoolTeamStanding {
  teamId: string;
  teamName: string;
  wins: number;
  losses: number;
  setsFor: number;
  setsAgainst: number;
  pointsFor: number;
  pointsAgainst: number;
}

export interface BracketMatch {
  id: string;
  team1Id: string | null;
  team2Id: string | null;
  team1Name?: string;
  team2Name?: string;
  team1Sets: number | null;
  team2Sets: number | null;
  completed: boolean;
  winnerId?: string | null;
  round: number;
  position: number;
}

export interface TournamentState {
  teams: Team[];
  poolMatches: PoolMatch[];
  pools: { [key: number]: Team[] };
  bracketMatches: BracketMatch[];
  bracketGenerated: boolean;
  goldBracketRoots: string[]; // Match IDs for first round of gold bracket
  silverBracketRoots: string[];
}
