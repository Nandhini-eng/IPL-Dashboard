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
      <table className="min-w-full text-sm text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
              Team
            </th>
            <th className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
              Matches
            </th>
            <th className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
              Wins
            </th>
            <th className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
              Losses
            </th>
            <th className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
              NRR
            </th>
            <th className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
              Points
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team, idx) => (
            <tr
              key={team.team}
              className={
                idx < 4
                  ? "bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500"
                  : "bg-white dark:bg-gray-800"
              }
            >
              <td className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                {team.team}
              </td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                {team.matches}
              </td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                {team.wins}
              </td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                {team.losses}
              </td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                {team.nrr.toFixed(2)}
              </td>
              <td className="px-4 py-2 font-bold text-gray-900 dark:text-white">
                {team.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PointsTable;
