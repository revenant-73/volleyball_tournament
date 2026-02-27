"use client";

import { useState } from "react";

interface MatchResultProps {
  matchId: string;
  onSubmit: (team1Sets: number, team2Sets: number) => void;
}

export default function MatchResult({ onSubmit }: MatchResultProps) {
  const [team1Sets, setTeam1Sets] = useState(0);
  const [team2Sets, setTeam2Sets] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    onSubmit(team1Sets, team2Sets);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
      >
        Enter Result
      </button>
    );
  }

  return (
    <div className="flex gap-2 items-center bg-slate-600 p-2 rounded">
      <input
        type="number"
        min="0"
        max="2"
        value={team1Sets}
        onChange={(e) => setTeam1Sets(Math.max(0, Math.min(2, parseInt(e.target.value) || 0)))}
        className="w-10 h-10 bg-slate-700 border border-slate-500 rounded text-center text-slate-100 font-bold"
      />
      <span className="text-slate-300 font-bold">-</span>
      <input
        type="number"
        min="0"
        max="2"
        value={team2Sets}
        onChange={(e) => setTeam2Sets(Math.max(0, Math.min(2, parseInt(e.target.value) || 0)))}
        className="w-10 h-10 bg-slate-700 border border-slate-500 rounded text-center text-slate-100 font-bold"
      />
      <button
        onClick={handleSubmit}
        className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition"
      >
        ✓
      </button>
      <button
        onClick={() => setIsOpen(false)}
        className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition"
      >
        ✕
      </button>
    </div>
  );
}
