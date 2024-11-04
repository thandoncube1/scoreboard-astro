import cron from "npm:node-cron";

// Write a log everytime the cron runs
function createLogs() {
    console.log('Cron job executed at: ', new Date().toLocaleString(), " at America/New_York");
}

// Schedule a cron job to run every minute
cron.schedule("0 5 * * *", () => {
    createLogs();
}, {
    scheduled: true,
    timezone: "America/New_York"
});