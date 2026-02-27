import { Team, PoolMatch, PoolTeamStanding, BracketMatch, TournamentState } from "@/types/tournament";

export function generatePoolMatches(teams: Team[]): PoolMatch[] {
  const matches: PoolMatch[] = [];
  let id = 0;

  for (let pool = 1; pool <= 3; pool++) {
    const poolTeams = teams.filter((t) => t.pool === pool);

    for (let i = 0; i < poolTeams.length; i++) {
      for (let j = i + 1; j < poolTeams.length; j++) {
        matches.push({
          id: `match-${id++}`,
          team1Id: poolTeams[i].id,
          team2Id: poolTeams[j].id,
          team1Sets: null,
          team2Sets: null,
          completed: false,
          poolId: pool,
        });
      }
    }
  }

  return matches;
}

export function getPoolStandings(
  teams: Team[],
  matches: PoolMatch[],
  poolId: number
): PoolTeamStanding[] {
  const poolTeams = teams.filter((t) => t.pool === poolId);
  const standings: { [key: string]: PoolTeamStanding } = {};

  poolTeams.forEach((team) => {
    standings[team.id] = {
      teamId: team.id,
      teamName: team.name,
      wins: 0,
      losses: 0,
      setsFor: 0,
      setsAgainst: 0,
      pointsFor: 0,
      pointsAgainst: 0,
    };
  });

  const poolMatches = matches.filter((m) => m.poolId === poolId && m.completed);

  poolMatches.forEach((match) => {
    const team1 = standings[match.team1Id];
    const team2 = standings[match.team2Id];

    if (!team1 || !team2 || match.team1Sets === null || match.team2Sets === null) {
      return;
    }

    team1.setsFor += match.team1Sets;
    team1.setsAgainst += match.team2Sets;
    team2.setsFor += match.team2Sets;
    team2.setsAgainst += match.team1Sets;

    if (match.team1Sets > match.team2Sets) {
      team1.wins++;
      team2.losses++;
    } else {
      team2.wins++;
      team1.losses++;
    }
  });

  return Object.values(standings).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.setsFor - b.setsAgainst - (a.setsFor - a.setsAgainst);
  });
}

export function generateBrackets(
  teams: Team[],
  matches: PoolMatch[]
): { bracketMatches: BracketMatch[]; goldBracketRoots: string[]; silverBracketRoots: string[] } {
  const goldTeams: PoolTeamStanding[] = [];
  const silverTeams: PoolTeamStanding[] = [];

  for (let pool = 1; pool <= 3; pool++) {
    const standings = getPoolStandings(teams, matches, pool);
    goldTeams.push(...standings.slice(0, 2));
    silverTeams.push(...standings.slice(2, 4));
  }

  goldTeams.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.setsFor - b.setsAgainst - (a.setsFor - a.setsAgainst);
  });

  silverTeams.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.setsFor - b.setsAgainst - (a.setsFor - a.setsAgainst);
  });

  const bracketMatches: BracketMatch[] = [];
  let matchId = 0;

  const goldBracketRoots: string[] = [];
  const silverBracketRoots: string[] = [];

  const createBracketRound = (
    teamsForBracket: PoolTeamStanding[],
    bracket: "gold" | "silver",
    roots: string[]
  ) => {
    let round = 1;
    let position = 0;
    let currentRoundMatches: string[] = [];

    for (let i = 0; i < teamsForBracket.length; i += 2) {
      const team1 = teamsForBracket[i];
      const team2 = teamsForBracket[i + 1] || null;

      const id = `${bracket}-match-${matchId++}`;
      bracketMatches.push({
        id,
        team1Id: team1.teamId,
        team2Id: team2 ? team2.teamId : null,
        team1Name: team1.teamName,
        team2Name: team2 ? team2.teamName : undefined,
        team1Sets: null,
        team2Sets: null,
        completed: false,
        round,
        position,
      });

      if (round === 1) {
        roots.push(id);
      }
      currentRoundMatches.push(id);
      position++;
    }
  };

  createBracketRound(goldTeams, "gold", goldBracketRoots);
  createBracketRound(silverTeams, "silver", silverBracketRoots);

  return { bracketMatches, goldBracketRoots, silverBracketRoots };
}
