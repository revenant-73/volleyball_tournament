"use client";

import { useState } from "react";
import { Team, BracketMatch } from "@/types/tournament";
import MatchResult from "./MatchResult";

interface BracketViewProps {
  teams: Team[];
  bracketMatches: BracketMatch[];
  goldBracketRoots: string[];
  silverBracketRoots: string[];
  onMatchUpdate?: (matchId: string, team1Sets: number, team2Sets: number) => void;
  readOnly?: boolean;
}

export default function BracketView({
  teams,
  bracketMatches,
  goldBracketRoots,
  silverBracketRoots,
  onMatchUpdate,
  readOnly = false,
}: BracketViewProps) {
  const [activeBracket, setActiveBracket] = useState<"gold" | "silver">("gold");

  const getTeamName = (teamId: string | null): string => {
    if (!teamId) return "TBD";
    return teams.find((t) => t.id === teamId)?.name || "Unknown";
  };

  const getMatchById = (id: string): BracketMatch | undefined => {
    return bracketMatches.find((m) => m.id === id);
  };

  const renderMatch = (matchId: string) => {
    const match = getMatchById(matchId);
    if (!match) return null;

    return (
      <div key={match.id} className="bg-slate-700 rounded p-3 min-w-64">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{getTeamName(match.team1Id)}</span>
            {match.completed ? (
              <span className="font-bold">{match.team1Sets}</span>
            ) : (
              <span className="text-slate-400">-</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">{getTeamName(match.team2Id)}</span>
            {match.completed ? (
              <span className="font-bold">{match.team2Sets}</span>
            ) : (
              <span className="text-slate-400">-</span>
            )}
          </div>
        </div>
        {!match.completed && !readOnly && (
          <div className="mt-3 pt-3 border-t border-slate-600">
            <MatchResult
              matchId={match.id}
              onSubmit={(team1Sets, team2Sets) => onMatchUpdate?.(match.id, team1Sets, team2Sets)}
            />
          </div>
        )}
      </div>
    );
  };

  const bracketRoots = activeBracket === "gold" ? goldBracketRoots : silverBracketRoots;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveBracket("gold")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeBracket === "gold"
              ? "border-yellow-500 text-yellow-400"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          Gold Bracket (6 Teams)
        </button>
        <button
          onClick={() => setActiveBracket("silver")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeBracket === "silver"
              ? "border-gray-400 text-gray-300"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          Silver Bracket (6 Teams)
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 overflow-x-auto">
        <div className="flex gap-8 min-w-max pb-6">
          {bracketRoots.map((rootId) => {
            const match = getMatchById(rootId);
            if (!match) return null;

            return (
              <div key={rootId} className="flex flex-col gap-8">
                {renderMatch(rootId)}
              </div>
            );
          })}
        </div>

        {bracketRoots.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No matches in this bracket yet
          </div>
        )}
      </div>

      <div className="bg-slate-700 p-4 rounded">
        <h3 className="font-bold mb-2">
          {activeBracket === "gold" ? "Gold" : "Silver"} Bracket Teams
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {bracketMatches
            .filter((m) => m.id.startsWith(activeBracket) && m.round === 1)
            .flatMap((m) => [m.team1Id, m.team2Id])
            .filter((id) => id !== null)
            .map((teamId) => (
              <div key={teamId} className="text-slate-300">
                • {getTeamName(teamId)}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
