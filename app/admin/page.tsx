"use client";

import { useState } from "react";
import { Team } from "@/types/tournament";
import { generatePoolMatches, generateBrackets } from "@/utils/tournament";
import TeamSetup from "@/components/TeamSetup";
import PoolPlay from "@/components/PoolPlay";
import BracketView from "@/components/BracketView";
import { useTournamentSync } from "@/hooks/useTournamentSync";

type Phase = "setup" | "pool-play" | "bracket";

export default function AdminPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const { tournamentState, updateState, loading } = useTournamentSync();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading tournament data...</div>
      </div>
    );
  }

  const handleTeamsAdded = (teams: Team[]) => {
    const poolMatches = generatePoolMatches(teams);
    updateState({
      ...tournamentState,
      teams,
      poolMatches,
    });
    setPhase("pool-play");
  };

  const handlePoolMatchUpdate = (matchId: string, team1Sets: number, team2Sets: number) => {
    updateState({
      ...tournamentState,
      poolMatches: tournamentState.poolMatches.map((m) =>
        m.id === matchId
          ? {
              ...m,
              team1Sets,
              team2Sets,
              completed: true,
            }
          : m
      ),
    });
  };

  const handleGenerateBrackets = () => {
    const { bracketMatches, goldBracketRoots, silverBracketRoots } = generateBrackets(
      tournamentState.teams,
      tournamentState.poolMatches
    );
    updateState({
      ...tournamentState,
      bracketMatches,
      goldBracketRoots,
      silverBracketRoots,
      bracketGenerated: true,
    });
    setPhase("bracket");
  };

  const handleBracketMatchUpdate = (matchId: string, team1Sets: number, team2Sets: number) => {
    updateState({
      ...tournamentState,
      bracketMatches: tournamentState.bracketMatches.map((m) =>
        m.id === matchId
          ? {
              ...m,
              team1Sets,
              team2Sets,
              completed: true,
              winnerId: team1Sets > team2Sets ? m.team1Id : m.team2Id,
            }
          : m
      ),
    });
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the entire tournament? This cannot be undone.")) {
      updateState({
        teams: [],
        poolMatches: [],
        pools: {},
        bracketMatches: [],
        bracketGenerated: false,
        goldBracketRoots: [],
        silverBracketRoots: [],
      });
      setPhase("setup");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold mb-2">Tournament Admin</h1>
            <p className="text-slate-400">Manage teams, pools, and scores</p>
          </div>
          <div className="bg-red-900/30 text-red-400 px-3 py-1 rounded text-sm font-bold border border-red-900/50">
            ADMIN MODE
          </div>
        </header>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setPhase("setup")}
            className={`px-4 py-2 rounded font-medium transition ${
              phase === "setup"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Setup
          </button>
          <button
            onClick={() => setPhase("pool-play")}
            disabled={tournamentState.teams.length === 0}
            className={`px-4 py-2 rounded font-medium transition ${
              phase === "pool-play"
                ? "bg-blue-600 text-white"
                : tournamentState.teams.length === 0
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Pool Play
          </button>
          <button
            onClick={() => setPhase("bracket")}
            disabled={!tournamentState.bracketGenerated}
            className={`px-4 py-2 rounded font-medium transition ${
              phase === "bracket"
                ? "bg-blue-600 text-white"
                : !tournamentState.bracketGenerated
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Bracket
          </button>
          <button
            onClick={handleReset}
            className="ml-auto px-4 py-2 rounded font-medium bg-red-900 text-red-100 hover:bg-red-800 transition"
          >
            Reset Tournament
          </button>
        </div>

        {phase === "setup" && <TeamSetup onTeamsAdded={handleTeamsAdded} />}

        {phase === "pool-play" && (
          <PoolPlay
            teams={tournamentState.teams}
            poolMatches={tournamentState.poolMatches}
            onMatchUpdate={handlePoolMatchUpdate}
            onGenerateBrackets={handleGenerateBrackets}
          />
        )}

        {phase === "bracket" && (
          <BracketView
            teams={tournamentState.teams}
            bracketMatches={tournamentState.bracketMatches}
            goldBracketRoots={tournamentState.goldBracketRoots}
            silverBracketRoots={tournamentState.silverBracketRoots}
            onMatchUpdate={handleBracketMatchUpdate}
          />
        )}
      </div>
    </main>
  );
}
