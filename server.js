import puppeteer from "npm:puppeteer";

const scrapeNBAGameStats = async (date) => {
    // Setup Constants for the Scraper
    const url = 'https://www.nba.com/games?date='

    const browser = await puppeteer.launch({
      headless: true
    });

    const page = await browser.newPage();
    await page.goto(`${url}${date}`, {
        waitUntil: "networkidle0",
        timeout: 30000
    });

    // SELECTOR CONSTANTS
    const selectors = {
      gameContainer: ".GameCardMatchup_wrapper__uUdW8",
      teamContainer: "span.MatchupCardTeamName_teamName__9YaBA"
    }

    console.log(`${url}${date}`);
    await page.waitForSelector(".GameCard_gc__UCI46");

    const games = await page.evaluate(() => {
        const gamesContainer = Array.from(document.querySelectorAll(".GameCard_gc__UCI46"));

        const gameData = gamesContainer.map(game => ({
            home: {
              team: game.querySelectorAll("span.MatchupCardTeamName_teamName__9YaBA")[0].innerHTML,
              teamLogo: game.querySelectorAll(".TeamLogo_logo__PclAJ")[0].getAttribute("src"),
              final: game.querySelectorAll(".MatchupCardScore_p__dfNvc")[0].textContent,
              gameLeader: {
                name: game.querySelectorAll(".GameCardLeaders_gclName__Oh5iE")[0].textContent,
                playerInfo: game.querySelectorAll(".GameCardLeaders_gclInfo__6QvJ_")[0].textContent,
                image: { src: game.querySelectorAll(".PlayerImage_image__wH_YX")[0].getAttribute("src"), alt: game.querySelectorAll(".PlayerImage_image__wH_YX")[0].getAttribute("alt")},
                leaderStats: {
                    pts: game.querySelectorAll(".GameCardLeaders_gclRow__VMSee > td:nth-child(2)")[0].textContent,
                    reb: game.querySelectorAll(".GameCardLeaders_gclRow__VMSee > td:nth-child(3)")[0].textContent,
                    ast: game.querySelectorAll(".GameCardLeaders_gclRow__VMSee > td:nth-child(4)")[0].textContent
                }
              }
            },
            away: {
              team: game.querySelectorAll("span.MatchupCardTeamName_teamName__9YaBA")[1].innerHTML,
              teamLogo: game.querySelectorAll(".TeamLogo_logo__PclAJ")[1].getAttribute("src"),
              final: game.querySelectorAll(".MatchupCardScore_p__dfNvc")[1].textContent,
              gameLeader: {
                name: game.querySelectorAll(".GameCardLeaders_gclName__Oh5iE")[1].textContent,
                playerInfo: game.querySelectorAll(".GameCardLeaders_gclInfo__6QvJ_")[1].textContent,
                image: { src: game.querySelectorAll(".PlayerImage_image__wH_YX")[1].getAttribute("src"), alt: game.querySelectorAll(".PlayerImage_image__wH_YX")[1].getAttribute("alt")},
                leaderStats: {
                  pts: game.querySelectorAll(".GameCardLeaders_gclRow__VMSee > td:nth-child(2)")[1].textContent,
                  reb: game.querySelectorAll(".GameCardLeaders_gclRow__VMSee > td:nth-child(3)")[1].textContent,
                  ast: game.querySelectorAll(".GameCardLeaders_gclRow__VMSee > td:nth-child(4)")[1].textContent
                }
              }
            },
            gameStatistics: {

            }
          })
        );

        return gameData;
    });

    console.log(games);

    await browser.close();
}

scrapeNBAGameStats("2024-11-02");