import puppeteer from "npm:puppeteer";

export const scrapeNBAGameStats = async (date) => {
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

    console.log(`${url}${date}`);
    await page.waitForSelector(".GameCard_gc__UCI46");

    const games = await page.evaluate(async () => {
        const gamesContainer = Array.from(document.querySelectorAll(".GameCard_gc__UCI46"));

        const gameData = gamesContainer.map(game => ({
            _uuid: window.crypto.randomUUID(),
            homeTeam: game.querySelectorAll("span.MatchupCardTeamName_teamName__9YaBA")[0].innerHTML,
            awayTeam: game.querySelectorAll("span.MatchupCardTeamName_teamName__9YaBA")[1].innerHTML,
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
            article: game.querySelector(".GameCard_gcm__SKtfh.GameCardMatchup_gameCardMatchup__H0uPe").getAttribute("href")
          })
        );

        return gameData;
    });

    await browser.close();

    return {nbaGames: games};
}

// Grab all game details from each page
export const scrapeNBAGameDetails = async (date) => {
    // Get url data from the main page
    const url = `https://www.nba.com/games?date=${date}`;

    const browser = await puppeteer.launch({
      headless: true
    });

    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: "networkidle0",
        timeout: 30000
    });

    // Get all game card links
    const gameLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('.GameCard_gcm__SKtfh');
      return Array.from(links).map(link => link.href);
    });

    console.log(`Found ${gameLinks.length} games`);

    const gameDetails = [];

    // Visit each game page and extract information
    for (const gameLink of gameLinks) {
      // Navigate to the game page
      await page.goto(gameLink, { waitUntil: 'networkidle0' });

      // Example: Extract game information
      const gameInfo = await page.evaluate(() => {
        // Add selectors for the specific information you want to extract
        // This is just an example - adjust based on the actual page structure
        const backgroundImg = document.querySelector(".GameHeroBackground_bgImage__ay_41");

        const gameBookPDF = document.querySelectorAll("a.Anchor_anchor__cSc3P.GameSummary_gsLink__47CuH")[0];

        const homeTeamName = document.querySelectorAll(".GameLinescore_table__a1awr > tbody > tr > td")[0]

        const Q1 = document.querySelectorAll(".GameLinescore_table__a1awr > tbody > tr > td:nth-child(2)")[0]
        const Q2 = document.querySelectorAll(".GameLinescore_table__a1awr > tbody > tr > td:nth-child(3)")[0]
        const Q3 = document.querySelectorAll(".GameLinescore_table__a1awr > tbody > tr > td:nth-child(4)")[0]
        const Q4 = document.querySelectorAll(".GameLinescore_table__a1awr > tbody > tr > td:nth-child(5)")[0]
        const FINAL = document.querySelectorAll(".GameLinescore_table__a1awr > tbody > tr > td:nth-child(6)")[0]

        const awayTeamName = document.querySelectorAll(".GameLinescore_table__a1awr > tbody > tr:nth-child(2) > td")[0]

        const Q1_ay = document.querySelectorAll(".GameLinescore_table__a1awr > tbody > tr:nth-child(2) > td:nth-child(2)")[0]
        const Q2_ay = document.querySelectorAll(".GameLinescore_table__a1awr > tbody > tr:nth-child(2) > td:nth-child(3)")[0]
        const Q3_ay = document.querySelectorAll(".GameLinescore_table__a1awr > tbody > tr:nth-child(2) > td:nth-child(4)")[0]
        const Q4_ay = document.querySelectorAll(".GameLinescore_table__a1awr > tbody > tr:nth-child(2) > td:nth-child(5)")[0]
        const FINAL_ay = document.querySelectorAll(".GameLinescore_table__a1awr > tbody > tr:nth-child(2) > td:nth-child(6)")[0]

        return {
          title: document.title,
          url: window.location.href,
          background_image: backgroundImg?.getAttribute("src"),
          game_book: gameBookPDF?.getAttribute("href"),
          homeTeam: {
              name: homeTeamName?.textContent,
              lineScores: {
                  fst_quarter: Q1?.textContent,
                  snd_quarter: Q2?.textContent,
                  trd_quarter: Q3?.textContent,
                  fth_quarter: Q4?.textContent,
                  final: FINAL?.textContent
              }
          },
          awayTeam: {
              name: awayTeamName?.textContent,
              lineScores: {
                fst_quarter: Q1_ay?.textContent,
                snd_quarter: Q2_ay?.textContent,
                trd_quarter: Q3_ay?.textContent,
                fth_quarter: Q4_ay?.textContent,
                final: FINAL_ay?.textContent
            }
          }
        };
      });

      // Push all game details into the container
      gameDetails.push(gameInfo);
    }

    // console.log(gameDetails);

    await browser.close();
    return gameDetails;
}
