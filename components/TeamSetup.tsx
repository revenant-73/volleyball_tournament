"use client";

import { useState } from "react";
import { Team } from "@/types/tournament";

interface TeamSetupProps {
  onTeamsAdded: (teams: Team[]) => void;
}

export default function TeamSetup({ onTeamsAdded }: TeamSetupProps) {
  const [teamName, setTeamName] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);

  const addTeam = () => {
    if (teamName.trim()) {
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: teamName.trim(),
        pool: undefined,
      };
      setTeams([...teams, newTeam]);
      setTeamName("");
    }
  };

  const removeTeam = (id: string) => {
    setTeams(teams.filter((t) => t.id !== id));
  };

  const assignToPool = (teamId: string, pool: number) => {
    setTeams(
      teams.map((t) =>
        t.id === teamId ? { ...t, pool } : t
      )
    );
  };

  const assignRandomPools = () => {
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    const assigned = shuffled.map((team, index) => ({
      ...team,
      pool: (index % 3) + 1,
    }));
    setTeams(assigned);
  };

  const handleStart = () => {
    if (teams.length === 12 && teams.every((t) => t.pool !== undefined)) {
      onTeamsAdded(teams);
    }
  };

  const teamsByPool = [1, 2, 3].map((pool) =>
    teams.filter((t) => t.pool === pool)
  );
  const unassigned = teams.filter((t) => t.pool === undefined);

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Setup Teams (12 teams required)</h2>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTeam()}
          placeholder="Team name..."
          className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 placeholder-slate-500"
        />
        <button
          onClick={addTeam}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition"
        >
          Add Team
        </button>
        <button
          onClick={assignRandomPools}
          disabled={teams.length < 12}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Auto Assign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">Unassigned</h3>
          <div className="space-y-2">
            {unassigned.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between bg-slate-700 p-2 rounded"
              >
                <span className="text-sm">{team.name}</span>
                <button
                  onClick={() => removeTeam(team.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {[1, 2, 3].map((pool) => (
          <div key={pool}>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Pool {pool}</h3>
            <div className="space-y-2">
              {teamsByPool[pool - 1].map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between bg-slate-700 p-2 rounded group"
                >
                  <span className="text-sm">{team.name}</span>
                  <button
                    onClick={() => removeTeam(team.id)}
                    className="text-red-400 hover:text-red-300 text-sm opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {[1, 2, 3].map((i) => (
                <div key={`placeholder-${i}`} className="opacity-0 h-10" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-slate-700 rounded">
        <p className="mb-2">
          <strong>Total Teams:</strong> {teams.length}/12
        </p>
        <p className="mb-4">
          <strong>Pool Distribution:</strong> Pool 1: {teamsByPool[0].length} | Pool 2:{" "}
          {teamsByPool[1].length} | Pool 3: {teamsByPool[2].length}
        </p>
        <button
          onClick={handleStart}
          disabled={teams.length !== 12 || unassigned.length > 0}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded font-bold text-lg transition"
        >
          Start Pool Play
        </button>
      </div>
    </div>
  );
}
