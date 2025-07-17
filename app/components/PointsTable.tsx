import React from "react";
import type { TeamStanding } from "../types";

interface PointsTableProps {
  teams: TeamStanding[];
}

const PointsTable: React.FC<PointsTableProps> = ({ teams }) => {
  // Sort teams by points descending, then NRR descending
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.nrr - a.nrr;
  });

  return (
    <div className="overflow-x-auto w-full max-w-2xl mx-auto mt-6">
      <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 font-semibold">Team</th>
            <th className="px-4 py-2 font-semibold">Matches</th>
            <th className="px-4 py-2 font-semibold">Wins</th>
            <th className="px-4 py-2 font-semibold">Losses</th>
            <th className="px-4 py-2 font-semibold">NRR</th>
            <th className="px-4 py-2 font-semibold">Points</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team, idx) => (
            <tr
              key={team.team}
              className={
                idx < 4
                  ? "bg-yellow-100 border-l-4 border-yellow-400"
                  : "bg-white"
              }
            >
              <td className="px-4 py-2 font-medium whitespace-nowrap">
                {team.team}
              </td>
              <td className="px-4 py-2">{team.matches}</td>
              <td className="px-4 py-2">{team.wins}</td>
              <td className="px-4 py-2">{team.losses}</td>
              <td className="px-4 py-2">{team.nrr.toFixed(2)}</td>
              <td className="px-4 py-2 font-bold">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PointsTable;
