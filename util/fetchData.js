// This is a faster process to get data quickly
import { scrapeNBAGameDetails, scrapeNBAGameStats } from "../server/deno/server.js";
import { formattedDate, saveFileData, FileManager } from "./helper.ts"

const date = formattedDate.split(' ')[0];

// Create a range of dates

const results = await scrapeNBAGameStats(date);

const save = await saveFileData("data/data-stats-game", results);

console.log(save);

const details = await scrapeNBAGameDetails(date);

const log = await saveFileData("data/data-detail-game", details);

console.log(log);