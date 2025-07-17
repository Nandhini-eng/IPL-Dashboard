// NOTE: You must install axios and cheerio: npm install axios cheerio
import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import path from "path";
import fs from "fs";
import { MatchInfo, TeamStanding, MatchSchedule } from "../../types";

const DATA_DIR = path.join(process.cwd(), "app", "data");

async function getFallbackData() {
  const [upcoming, pointsTable, schedule] = [
    JSON.parse(fs.readFileSync(path.join(DATA_DIR, "matches.json"), "utf-8")),
    JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, "pointsTable.json"), "utf-8")
    ),
    JSON.parse(fs.readFileSync(path.join(DATA_DIR, "schedule.json"), "utf-8")),
  ];
  return {
    upcomingMatch: upcoming || null,
    pointsTable: pointsTable || [],
    fullSchedule: schedule || [],
  };
}

async function scrapeIplData() {
  const url = "https://www.iplt20.com";
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const $ = cheerio.load(data);

  // --- Scrape Upcoming/Live Match ---
  let upcomingMatch: MatchInfo | null = null;
  try {
    const matchEl = $(".match-list__item").first();
    const teamA = matchEl.find(".team-1 .name").text().trim();
    const teamB = matchEl.find(".team-2 .name").text().trim();
    const dateTime = matchEl.find(".match-info .date").text().trim();
    const venue = matchEl.find(".match-info .venue").text().trim();
    const status = matchEl.find(".status").text().toLowerCase().includes("live")
      ? "live"
      : "upcoming";
    if (teamA && teamB && dateTime && venue) {
      upcomingMatch = { teamA, teamB, dateTime, venue, status };
    }
  } catch (e) {
    upcomingMatch = null;
  }

  // --- Scrape Points Table ---
  let pointsTable: TeamStanding[] = [];
  try {
    $("#points-table tbody tr").each((_: number, el: any) => {
      const tds = $(el).find("td");
      if (tds.length >= 8) {
        pointsTable.push({
          team: $(tds[1]).text().trim(),
          matches: parseInt($(tds[2]).text().trim(), 10),
          wins: parseInt($(tds[3]).text().trim(), 10),
          losses: parseInt($(tds[5]).text().trim(), 10),
          nrr: parseFloat($(tds[6]).text().trim()),
          points: parseInt($(tds[7]).text().trim(), 10),
        });
      }
    });
  } catch (e) {
    pointsTable = [];
  }

  // --- Scrape Full Schedule ---
  let fullSchedule: MatchSchedule[] = [];
  try {
    $(".fixtures-list .fixture-block").each((_: number, el: any) => {
      const date = $(el).find(".fixture-date").text().trim();
      const time = $(el).find(".fixture-time").text().trim();
      const teamA = $(el).find(".team-1 .name").text().trim();
      const teamB = $(el).find(".team-2 .name").text().trim();
      const venue = $(el).find(".fixture-venue").text().trim();
      if (date && time && teamA && teamB && venue) {
        fullSchedule.push({ date, time, teamA, teamB, venue });
      }
    });
  } catch (e) {
    fullSchedule = [];
  }

  return { upcomingMatch, pointsTable, fullSchedule };
}

export async function GET() {
  try {
    const scraped = await scrapeIplData();
    if (
      !scraped.upcomingMatch ||
      scraped.pointsTable.length === 0 ||
      scraped.fullSchedule.length === 0
    ) {
      const fallback = await getFallbackData();
      return NextResponse.json(fallback);
    }
    return NextResponse.json(scraped);
  } catch (error) {
    const fallback = await getFallbackData();
    return NextResponse.json(fallback);
  }
}
