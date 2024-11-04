import cron from "npm:node-cron";
import { saveFileData, formattedDate, FileManager } from "./helper.js";

const fileManager = new FileManager(formattedDate);

// Write a log everytime the cron runs
function createLogs() {
    console.log('Cron job executed at: ', new Date().toLocaleString(), " at America/New_York");

    fileManager.
}

// Schedule a cron job to run every minute
cron.schedule("0 5 * * *", () => {
    createLogs();
}, {
    scheduled: true,
    timezone: "America/New_York"
});