import { useEffect, useState } from "react";
import type { MatchInfo, TeamStanding, MatchSchedule } from "../types";
import axios from "axios";

const API_URL = "/api/scrape";

export async function fetchMatchInfo(): Promise<MatchInfo | null> {
  const res = await axios.get(API_URL);
  return res.data.upcomingMatch || null;
}

export async function fetchPointsTable(): Promise<TeamStanding[]> {
  const res = await axios.get(API_URL);
  return res.data.pointsTable || [];
}

export async function fetchSchedule(): Promise<MatchSchedule[]> {
  const res = await axios.get(API_URL);
  return res.data.fullSchedule || [];
}

// Client-side fallback hook for CSR
export function useIplData() {
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const [pointsTable, setPointsTable] = useState<TeamStanding[]>([]);
  const [schedule, setSchedule] = useState<MatchSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setMatchInfo(data.upcomingMatch || null);
        setPointsTable(data.pointsTable || []);
        setSchedule(data.fullSchedule || []);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError("Failed to fetch IPL data");
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { matchInfo, pointsTable, schedule, loading, error };
}
