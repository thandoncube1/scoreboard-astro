import cron from "npm:node-cron";
import { saveFileData, formattedDate, FileManager } from "./helper.ts";
// Import the webCrawlers
import { scrapeNBAGameDetails, scrapeNBAGameStats } from "../server/deno/server.js";

const fileManager = new FileManager('cronjob_log', 'txt');
// Get the time zone
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Write a log everytime the cron runs
function createLogs(details) {
    console.log('Cron job executed at: ', new Date().toLocaleString(), " at " + timezone);
    fileManager.appendLogs(`Cron job executed at: , ${new Date().toLocaleString()}, at ${timezone} - ${details}`);
}

// Schedule a cron job to run every minute
cron.schedule("0 5 * * *", async () => {
    try {
        const date = formattedDate.split(' ')[0];
        const results = await scrapeNBAGameDetails(date);
        const save = saveFileData("../data/data-detail-games", results);
        const processedString = JSON.stringify({save, results}, null, 2);
        createLogs(processedString);
    } catch (error) {
        createLogs(error);
    };
}, {
    scheduled: true,
    timezone
});

cron.schedule("30 5 * * *", async () => {
    try {
        const date = formattedDate.split(' ')[0];
        const results = await scrapeNBAGameStats(date);
        const save = saveFileData("../data/data-stats-games", results);
        const processedString = JSON.stringify({save, results}, null, 2);
        createLogs(processedString);
    } catch (error) {
        createLogs(error);
    };
}, {
    scheduled: true,
    timezone
});