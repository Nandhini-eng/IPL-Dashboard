/**
 * Standalone IPL Points Table Scraper
 *
 * PURPOSE:
 * - Generate/update fallback data for pointsTable.json
 * - Test scraping logic independently from the Next.js app
 * - Debug scraping issues without running the full application
 *
 * USAGE:
 * - Run: node scripts/scrape-ipl-points-table.js
 * - Output: Updates app/data/pointsTable.json with current IPL standings
 *
 * NOTE: This script is for development/maintenance purposes only.
 * The main application uses the scraping logic in app/api/scrape/route.ts
 */

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9",
  });
  await page.goto("https://www.iplt20.com/points-table/men", {
    waitUntil: "networkidle2",
  });

  // Try waiting for the table rows
  await page.waitForFunction(
    () => document.querySelectorAll("#pointtable table tbody tr").length > 0,
    { timeout: 20000 }
  );

  const tableHTML = await page.$eval("#pointtable table", (el) => el.outerHTML);
  await browser.close();

  // Parse with Cheerio
  const $$ = cheerio.load(tableHTML);
  const pointsTable = [];
  $$("tbody tr").each((_, el) => {
    const tds = $$(el).find("td");
    // Find the <h2> (team name) cell
    let teamIdx = -1;
    tds.each((i, td) => {
      if ($$(td).find("h2").length > 0) teamIdx = i;
    });
    if (teamIdx === -1) return; // skip if no team cell

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

  // Save to app/data/pointsTable.json
  const dataDir = path.join(__dirname, "../app/data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(
    path.join(dataDir, "pointsTable.json"),
    JSON.stringify(pointsTable, null, 2),
    "utf-8"
  );
  console.log("Points table data saved to app/data/pointsTable.json");
})();
