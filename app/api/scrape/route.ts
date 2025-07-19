// NOTE: You must install axios and cheerio: npm install axios cheerio
import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import path from "path";
import fs from "fs";
import { MatchInfo, TeamStanding, MatchSchedule } from "../../types";
import puppeteer from "puppeteer";

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
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9",
  });

  let upcomingMatch: MatchInfo | null = null;
  let fullSchedule: MatchSchedule[] = [];
  let pointsTable: TeamStanding[] = [];

  // ---------------------- Fixtures Scraping ----------------------
  try {
    await page.goto("https://www.iplt20.com/matches/fixtures", {
      waitUntil: "networkidle2",
    });

    let fixturesHtml: string | null = null;
    try {
      await page.waitForSelector("#smFixturesWidget", { timeout: 10000 });
      fixturesHtml = await page.$eval(
        "#smFixturesWidget",
        (el) => el.innerHTML
      );
    } catch (err) {
      console.warn("Fixtures widget not found — likely off-season.");
      fixturesHtml = null;
    }

    if (fixturesHtml) {
      const $ = cheerio.load(fixturesHtml);

      $(".fixture-block").each((index, el) => {
        const date = $(el).find(".fixture-date").text().trim();
        const time = $(el).find(".fixture-time").text().trim();
        const teamA = $(el).find(".team-1 .name").text().trim();
        const teamB = $(el).find(".team-2 .name").text().trim();
        const venue = $(el).find(".fixture-venue").text().trim();
        const statusText = $(el)
          .find(".fixture-state")
          .text()
          .trim()
          .toLowerCase();
        const status = statusText.includes("live") ? "live" : "upcoming";

        if (date && time && teamA && teamB && venue) {
          fullSchedule.push({ date, time, teamA, teamB, venue });

          if (!upcomingMatch && (status === "live" || status === "upcoming")) {
            upcomingMatch = {
              teamA,
              teamB,
              dateTime: `${date}, ${time}`,
              venue,
              status,
            };
          }
        }
      });
    } else {
      console.log("No fixture data available currently.");
    }
  } catch (e) {
    console.error("Error scraping fixtures:", e);
    fullSchedule = [];
    upcomingMatch = null;
  }

  // ---------------------- Points Table Scraping ----------------------
  try {
    await page.goto("https://www.iplt20.com/points-table/men", {
      waitUntil: "networkidle2",
    });

    await page.waitForFunction(
      () => document.querySelectorAll("#pointtable table tbody tr").length > 0,
      { timeout: 15000 }
    );

    const tableHTML = await page.$eval(
      "#pointtable table",
      (el) => el.outerHTML
    );
    const $$ = cheerio.load(tableHTML);

    $$("tbody tr").each((_, el) => {
      const tds = $$(el).find("td");
      let teamIdx = -1;

      tds.each((i, td) => {
        if ($$(td).find("h2").length > 0) teamIdx = i;
      });

      if (teamIdx === -1) return;

      pointsTable.push({
        team: $$(tds[teamIdx]).find("h2").text().trim(),
        matches: parseInt(
          $$(tds[teamIdx + 1])
            .text()
            .trim(),
          10
        ),
        wins: parseInt(
          $$(tds[teamIdx + 2])
            .text()
            .trim(),
          10
        ),
        losses: parseInt(
          $$(tds[teamIdx + 3])
            .text()
            .trim(),
          10
        ),
        nrr: parseFloat(
          $$(tds[teamIdx + 5])
            .text()
            .trim()
        ),
        points: parseInt(
          $$(tds[teamIdx + 8])
            .text()
            .trim(),
          10
        ),
      });
    });
  } catch (e) {
    console.error("Error scraping points table:", e);
    pointsTable = [];
  }

  await browser.close();

  return {
    upcomingMatch,
    fullSchedule,
    pointsTable,
  };
}

export async function GET() {
  try {
    const scraped = await scrapeIplData();

    // Get fallback data for potential partial failures
    const fallback = await getFallbackData();

    // Use successful scraped data, fallback only for failed parts
    const response = {
      upcomingMatch: scraped.upcomingMatch || fallback.upcomingMatch,
      pointsTable:
        scraped.pointsTable.length > 0
          ? scraped.pointsTable
          : fallback.pointsTable,
      fullSchedule:
        scraped.fullSchedule.length > 0
          ? scraped.fullSchedule
          : fallback.fullSchedule,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Complete scraping failure:", error);
    const fallback = await getFallbackData();
    return NextResponse.json(fallback);
  }
}
