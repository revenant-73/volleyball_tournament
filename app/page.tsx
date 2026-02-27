"use client";

import { useState } from "react";
import { useTournamentSync } from "@/hooks/useTournamentSync";
import PoolPlay from "@/components/PoolPlay";
import BracketView from "@/components/BracketView";
import Link from "next/link";

type Phase = "pool-play" | "bracket";

export default function PublicPage() {
  const { tournamentState, loading } = useTournamentSync();
  const [phase, setPhase] = useState<Phase>("pool-play");

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading tournament data...</div>
      </div>
    );
  }

  if (tournamentState.teams.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">No Active Tournament</h1>
        <p className="text-slate-400 mb-8">The tournament has not been set up yet. Check back later!</p>
        <Link href="/admin" className="text-blue-400 hover:underline">Go to Admin Setup</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tournament Schedule</h1>
          <p className="text-slate-400">Live results and standings</p>
        </header>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setPhase("pool-play")}
            className={`px-4 py-2 rounded font-medium transition ${
              phase === "pool-play"
                ? "bg-blue-600 text-white"
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
        </div>

        {phase === "pool-play" && (
          <PoolPlay
            teams={tournamentState.teams}
            poolMatches={tournamentState.poolMatches}
            readOnly={true}
          />
        )}

        {phase === "bracket" && (
          <BracketView
            teams={tournamentState.teams}
            bracketMatches={tournamentState.bracketMatches}
            goldBracketRoots={tournamentState.goldBracketRoots}
            silverBracketRoots={tournamentState.silverBracketRoots}
            readOnly={true}
          />
        )}
        
        <footer className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Volleyball Tournament Management</p>
        </footer>
      </div>
    </main>
  );
}
