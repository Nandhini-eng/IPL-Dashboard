import MatchBanner from "./components/MatchBanner";
import PointsTable from "./components/PointsTable";
import { MatchInfo, TeamStanding } from "./types";
import fs from "fs";
import path from "path";

export const revalidate = 60; // ISR: revalidate every 60 seconds

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Fallback data function
async function getFallbackData() {
  try {
    const dataDir = path.join(process.cwd(), "app", "data");
    const [upcoming, pointsTable] = [
      JSON.parse(fs.readFileSync(path.join(dataDir, "matches.json"), "utf-8")),
      JSON.parse(
        fs.readFileSync(path.join(dataDir, "pointsTable.json"), "utf-8")
      ),
    ];
    return {
      upcomingMatch: upcoming || null,
      pointsTable: pointsTable || [],
    };
  } catch (error) {
    console.error("Error reading fallback data:", error);
    return {
      upcomingMatch: null,
      pointsTable: [],
    };
  }
}

export default async function Home() {
  let upcomingMatch: MatchInfo | null = null;
  let pointsTable: TeamStanding[] = [];

  try {
    // Only fetch from API if BASE_URL is properly configured
    if (BASE_URL && BASE_URL !== "http://localhost:3000") {
      const res = await fetch(`${BASE_URL}/api/scrape`, {
        next: { revalidate },
      });

      if (res.ok) {
        const data = await res.json();
        upcomingMatch = data.upcomingMatch || null;
        pointsTable = data.pointsTable || [];
      } else {
        console.warn("API request failed, using fallback data");
        const fallback = await getFallbackData();
        upcomingMatch = fallback.upcomingMatch;
        pointsTable = fallback.pointsTable;
      }
    } else {
      // Use fallback data during build or when BASE_URL is not set
      const fallback = await getFallbackData();
      upcomingMatch = fallback.upcomingMatch;
      pointsTable = fallback.pointsTable;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    const fallback = await getFallbackData();
    upcomingMatch = fallback.upcomingMatch;
    pointsTable = fallback.pointsTable;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8 gap-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        IPL Dashboard
      </h1>
      <MatchBanner match={upcomingMatch || undefined} />
      <section className="w-full max-w-2xl mt-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Points Table (Top 4)
        </h2>
        <PointsTable teams={pointsTable.slice(0, 4)} />
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Showing top 4 teams
        </div>
      </section>
    </div>
  );
}
