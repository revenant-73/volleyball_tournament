"use client";

import { PoolTeamStanding } from "@/types/tournament";

interface PoolStandingsProps {
  standings: PoolTeamStanding[];
}

export default function PoolStandings({ standings }: PoolStandingsProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Standings</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-2">Team</th>
            <th className="text-center py-2">W</th>
            <th className="text-center py-2">L</th>
            <th className="text-center py-2">Sets</th>
          </tr>
        </thead>
        <tbody className="space-y-2">
          {standings.map((standing, i) => (
            <tr key={standing.teamId} className="border-b border-slate-700">
              <td className="py-2">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-700 w-6 h-6 rounded flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="truncate">{standing.teamName}</span>
                </div>
              </td>
              <td className="text-center py-2 font-medium">{standing.wins}</td>
              <td className="text-center py-2">{standing.losses}</td>
              <td className="text-center py-2 text-xs text-slate-400">
                {standing.setsFor}-{standing.setsAgainst}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
