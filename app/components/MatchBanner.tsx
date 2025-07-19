import React from "react";
import type { MatchInfo } from "../types";

interface MatchBannerProps {
  match?: MatchInfo;
}

const Skeleton = () => (
  <div className="animate-pulse p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md w-full max-w-md mx-auto">
    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-4" />
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2" />
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2" />
    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/4" />
  </div>
);

const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const statusStyles: Record<MatchInfo["status"], string> = {
  live: "bg-red-500 text-white",
  upcoming: "bg-blue-500 text-white",
};

const MatchBanner: React.FC<MatchBannerProps> = ({ match }) => {
  if (!match) return <Skeleton />;

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md w-full max-w-md mx-auto mt-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          {match.teamA}{" "}
          <span className="text-gray-500 dark:text-gray-400 font-normal">
            vs
          </span>{" "}
          {match.teamB}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusStyles[match.status]
          }`}
        >
          {match.status === "live" ? "Live" : "Upcoming"}
        </span>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        <span className="block">
          <span className="font-medium">Date & Time:</span>{" "}
          {formatDateTime(match.dateTime)}
        </span>
        <span className="block">
          <span className="font-medium">Venue:</span> {match.venue}
        </span>
      </div>
    </div>
  );
};

export default MatchBanner;
