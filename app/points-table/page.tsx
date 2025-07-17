import PointsTable from "../components/PointsTable";
import type { TeamStanding } from "../types";
import React from "react";

const revalidate = 60;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function PointsTablePage() {
  const res = await fetch(`${BASE_URL}/api/scrape`, {
    next: { revalidate },
  });
  const data = await res.json();
  const teams: TeamStanding[] = data.pointsTable || [];

  return (
    <main className="flex flex-col items-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl sm:text-3xl font-bold mt-6 mb-4 text-center w-full">
        IPL 2024 Points Table
      </h1>
      <PointsTable teams={teams} />
    </main>
  );
}
