import MatchBanner from "./components/MatchBanner";
import PointsTable from "./components/PointsTable";
import { MatchInfo, TeamStanding } from "./types";

export default async function Home() {
  // Fetch data from the API route with revalidation (ISR)
  const res = await fetch("http://localhost:3000/api/scrape", {
    next: { revalidate: 60 },
  });
  const {
    upcomingMatch,
    pointsTable,
  }: { upcomingMatch: MatchInfo | null; pointsTable: TeamStanding[] } =
    await res.json();

  return (
    <div className="flex flex-col items-center min-h-screen p-8 gap-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">IPL Dashboard</h1>
      <MatchBanner match={upcomingMatch || undefined} />
      <section className="w-full max-w-2xl mt-8">
        <h2 className="text-xl font-semibold mb-2">Points Table (Top 4)</h2>
        <PointsTable teams={pointsTable.slice(0, 4)} />
        <div className="text-xs text-gray-500 mt-2">Showing top 4 teams</div>
      </section>
    </div>
  );
}
