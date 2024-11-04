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
        const result = await scrapeNBAGameDetails(formattedDate);
        createLogs(result);
    } catch (error) {
        createLogs(error);
    };
}, {
    scheduled: true,
    timezone
});