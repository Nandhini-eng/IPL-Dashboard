export interface MatchInfo {
  teamA: string;
  teamB: string;
  dateTime: string;
  venue: string;
  status: "live" | "upcoming";
}

export interface TeamStanding {
  team: string;
  matches: number;
  wins: number;
  losses: number;
  nrr: number;
  points: number;
}

export interface MatchSchedule {
  date: string;
  time: string;
  teamA: string;
  teamB: string;
  venue: string;
}
