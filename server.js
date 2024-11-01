import express from 'npm:express';
import puppeteer from 'npm:puppeteer';
const app = express();
const port = 3000;

// Function to scrape NBA game results
// async function scrapeNBAGames() {
//     const browser = await puppeteer.launch({
//         headless: 'shell',
//         args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });

//     try {
//         const page = await browser.newPage();
//         await page.goto('https://www.thescore.com/nba/news', {
//             waitUntil: 'networkidle0'
//         });

//         // Wait for the scores section to load
//         await page.waitForSelector('.GameCard');

//         // Extract game data
//         const games = await page.evaluate(() => {
//             const gameCards = document.querySelectorAll('.GameCard');
//             return Array.from(gameCards).map(card => {
//                 // Extract team names
//                 const teams = Array.from(card.querySelectorAll('.TeamName')).map(team => team.textContent.trim());

//                 // Extract scores for each quarter
//                 const quarterScores = Array.from(card.querySelectorAll('.ScoreboardScoreCell')).map(
//                     score => score.textContent.trim()
//                 );

//                 // Extract game date
//                 const dateElement = card.querySelector('.GameDate');
//                 const date = dateElement ? dateElement.textContent.trim() : '';

//                 // Organize quarter scores
//                 const awayTeamScores = quarterScores.slice(0, 4);
//                 const homeTeamScores = quarterScores.slice(4, 8);

//                 return {
//                     date: date,
//                     awayTeam: {
//                         name: teams[0],
//                         quarters: {
//                             Q1: awayTeamScores[0],
//                             Q2: awayTeamScores[1],
//                             Q3: awayTeamScores[2],
//                             Q4: awayTeamScores[3]
//                         }
//                     },
//                     homeTeam: {
//                         name: teams[1],
//                         quarters: {
//                             Q1: homeTeamScores[0],
//                             Q2: homeTeamScores[1],
//                             Q3: homeTeamScores[2],
//                             Q4: homeTeamScores[3]
//                         }
//                     }
//                 };
//             });
//         });

//         await browser.close();
//         return games;
//     } catch (error) {
//         console.error('Scraping error:', error);
//         await browser.close();
//         throw error;
//     }
// }

// Function to get yesterday's date in the format MM/DD/YYYY
// Function to get yesterday's date in the format YYYY-MM-DD
function getYesterdayDate() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
}

async function scrapeYesterdayGames() {
    const browser = await puppeteer.launch({
        headless: 'shell',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // Navigate to the NBA scores page
        await page.goto('https://www.thescore.com/nba/events/date/2024-10-30', {
            waitUntil: 'networkidle0'
        });

        // Wait for selector to load
        const pageSelector = await page.waitForSelector('.Events__events--1ts1H');
        console.log("Page Selector: ", pageSelector);
        // Extract games from theScore page
        // const games = await page.evaluate(() => {
        //     const gameCards = document.querySelectorAll('.Events__eventCardGrid--x_55V');

        //     console.log("Game Cards: ", gameCards);
        //     return gameCards;
        // });

        await browser.close();
        console.log("Games in the Evaluate: ", games);
        return games;
    } catch (error) {
        console.error('Scraping error:', error);
        await browser.close();
        throw error;
    }
}

// Add debugging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// API endpoint to get yesterday's NBA games
app.get('/api/nba/yesterday', async (req, res) => {
    try {
        console.log('Scraping games for:', getYesterdayDate());
        const games = await scrapeYesterdayGames();
        console.log("Games: ", games);
        if (games.length === 0) {
            res.json({
                status: 'success',
                message: 'No games were played yesterday',
                data: []
            });
        } else {
            res.json({
                status: 'success',
                date: getYesterdayDate(),
                gamesCount: games.length,
                data: games
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch yesterday\'s NBA games',
            error: error.message
        });
    }
});

// API endpoint to get NBA games
app.get('/api/nba/games', async (req, res) => {
    try {
        const games = await scrapeNBAGames();
        res.json({
            status: 'success',
            data: games
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch NBA games',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

// Start the server
app.listen(port, () => {
    console.log(`NBA scraper API running on port ${port}`);
});