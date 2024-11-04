import cron from "npm:node-cron";
import { saveFileData, formattedDate, FileManager } from "./helper.js";
// Import the webCrawlers
import { scrapeNBAGameDetails, scrapeNBAGameStats } from "../server.js";

const fileManager = new FileManager(formattedDate, 'cronjob_log', 'txt');
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
        const results = await scrapeNBAGameDetails(formattedDate);
        const save = saveFileData("../data/data-detail-games", results, formattedDate);
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
        const results = await scrapeNBAGameStats(formattedDate);
        const save = saveFileData("../data/data-stats-games", results, formattedDate);
        const processedString = JSON.stringify({save, results}, null, 2);
        createLogs(processedString);
    } catch (error) {
        createLogs(error);
    };
}, {
    scheduled: true,
    timezone
});