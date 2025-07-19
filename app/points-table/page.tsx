import PointsTable from "../components/PointsTable";
import type { TeamStanding } from "../types";
import React from "react";
import fs from "fs";
import path from "path";

const revalidate = 60;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Fallback data function
async function getFallbackData(): Promise<TeamStanding[]> {
  try {
    const dataPath = path.join(
      process.cwd(),
      "app",
      "data",
      "pointsTable.json"
    );
    const data = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading fallback data:", error);
    return [];
  }
}

export default async function PointsTablePage() {
  let teams: TeamStanding[] = [];

  try {
    // Only fetch from API if BASE_URL is properly configured
    if (BASE_URL && BASE_URL !== "http://localhost:3000") {
      const res = await fetch(`${BASE_URL}/api/scrape`, {
        next: { revalidate },
      });

      if (res.ok) {
        const data = await res.json();
        teams = data.pointsTable || [];
      } else {
        console.warn("API request failed, using fallback data");
        teams = await getFallbackData();
      }
    } else {
      // Use fallback data during build or when BASE_URL is not set
      teams = await getFallbackData();
    }
  } catch (error) {
    console.error("Error fetching points table data:", error);
    teams = await getFallbackData();
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl sm:text-3xl font-bold mt-6 mb-4 text-center w-full">
        IPL 2024 Points Table
      </h1>
      <PointsTable teams={teams} />
    </main>
  );
}
