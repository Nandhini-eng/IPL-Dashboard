import React from "react";
import type { MatchSchedule } from "../types";

interface ScheduleListProps {
  schedule: MatchSchedule[];
}

// Helper to group matches by date
const groupByDate = (matches: MatchSchedule[]) => {
  return matches.reduce<Record<string, MatchSchedule[]>>((acc, match) => {
    if (!acc[match.date]) acc[match.date] = [];
    acc[match.date].push(match);
    return acc;
  }, {});
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ScheduleList: React.FC<ScheduleListProps> = ({ schedule }) => {
  const grouped = groupByDate(schedule);
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="w-full max-w-xl mx-auto mt-6">
      {sortedDates.map((date) => (
        <div key={date} className="mb-6">
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2 px-2">
            {formatDate(date)}
          </h3>
          <ul className="flex flex-col gap-3">
            {grouped[date].map((match, idx) => (
              <li
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-gray-100 dark:border-gray-700"
              >
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {match.time}
                  </div>
                  <div className="text-lg font-bold text-gray-800 dark:text-white">
                    {match.teamA}{" "}
                    <span className="text-gray-500 dark:text-gray-400 font-normal">
                      vs
                    </span>{" "}
                    {match.teamB}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {match.venue}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ScheduleList;
