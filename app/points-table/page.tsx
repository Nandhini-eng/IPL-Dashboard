import PointsTable from "../components/PointsTable";
import type { TeamStanding } from "../types";
import Link from "next/link";
import React from "react";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function PointsTablePage() {
  const res = await fetch("http://localhost:3000/api/scrape", {
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
