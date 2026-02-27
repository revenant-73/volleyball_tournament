"use client";

import { useState } from "react";
import { Team, PoolMatch } from "@/types/tournament";
import { getPoolStandings } from "@/utils/tournament";
import PoolStandings from "./PoolStandings";
import MatchResult from "./MatchResult";

interface PoolPlayProps {
  teams: Team[];
  poolMatches: PoolMatch[];
  onMatchUpdate: (matchId: string, team1Sets: number, team2Sets: number) => void;
  onGenerateBrackets: () => void;
}

export default function PoolPlay({
  teams,
  poolMatches,
  onMatchUpdate,
  onGenerateBrackets,
}: PoolPlayProps) {
  const [activePool, setActivePool] = useState(1);

  const poolTeams = teams.filter((t) => t.pool === activePool);
  const poolMatchesForActive = poolMatches.filter((m) => m.poolId === activePool);
  const standings = getPoolStandings(teams, poolMatches, activePool);

  const allPoolsComplete = [1, 2, 3].every((pool) => {
    const matches = poolMatches.filter((m) => m.poolId === pool);
    return matches.length > 0 && matches.every((m) => m.completed);
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-slate-700">
        {[1, 2, 3].map((pool) => (
          <button
            key={pool}
            onClick={() => setActivePool(pool)}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activePool === pool
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            Pool {pool}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Matches</h3>
            <div className="space-y-3">
              {poolMatchesForActive.map((match) => {
                const team1 = teams.find((t) => t.id === match.team1Id);
                const team2 = teams.find((t) => t.id === match.team2Id);

                return (
                  <div
                    key={match.id}
                    className={`bg-slate-700 p-4 rounded ${
                      match.completed ? "border-l-4 border-green-500" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium">{team1?.name}</p>
                        <p className="text-sm text-slate-400">vs</p>
                        <p className="font-medium">{team2?.name}</p>
                      </div>

                      <div className="flex gap-2">
                        {match.completed && match.team1Sets !== null && match.team2Sets !== null ? (
                          <div className="text-center">
                            <div className="text-xl font-bold">{match.team1Sets}</div>
                            <div className="text-xs text-slate-400">-</div>
                            <div className="text-xl font-bold">{match.team2Sets}</div>
                          </div>
                        ) : (
                          <MatchResult
                            matchId={match.id}
                            onSubmit={(team1Sets, team2Sets) =>
                              onMatchUpdate(match.id, team1Sets, team2Sets)
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <PoolStandings standings={standings} />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onGenerateBrackets}
          disabled={!allPoolsComplete}
          className={`flex-1 px-6 py-3 rounded font-bold text-lg transition ${
            allPoolsComplete
              ? "bg-green-600 hover:bg-green-700"
              : "bg-slate-600 cursor-not-allowed opacity-50"
          }`}
        >
          Generate Brackets
        </button>
      </div>

      {!allPoolsComplete && (
        <div className="bg-yellow-900 border border-yellow-700 text-yellow-100 p-4 rounded">
          ⚠️ Complete all pool matches to generate brackets
        </div>
      )}
    </div>
  );
}
