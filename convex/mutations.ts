import { mutation } from "./_generated/server.js";
import { v } from "convex/values";

export const importGamesFromJSON = mutation({
  args: {
    jsonData: v.array(
      v.object({
        date: v.string(),
        games: v.array(
          v.object({
            _uuid: v.string(),
            title: v.string(),
            url: v.string(),
            backgroundImage: v.optional(v.string()),
            gameBook: v.optional(v.string()),
            homeTeam: v.object({
              name: v.string(),
              lineScores: v.object({
                fstQuarter: v.string(),
                sndQuarter: v.string(),
                trdQuarter: v.string(),
                fthQuarter: v.string(),
                final: v.string()
              })
            }),
            awayTeam: v.object({
              name: v.string(),
              lineScores: v.object({
                fstQuarter: v.string(),
                sndQuarter: v.string(),
                trdQuarter: v.string(),
                fthQuarter: v.string(),
                final: v.string()
              })
            })
          })
        )
      })
    )
  },
  handler: async (ctx, args) => {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const dayData of args.jsonData) {
      try {
        // Check for existing game day
        const existingGameDay = await ctx.db
          .query("gameDays")
          .filter(q => q.eq(q.field("date"), dayData.date))
          .first();

        // Create or update game day
        const gameDayId = existingGameDay
          ? existingGameDay._id
          : await ctx.db.insert("gameDays", {
              date: dayData.date,
              gamesCount: dayData.games.length,
              status: "completed",
              lastUpdated: Date.now()
            });

        // If updating, remove old games
        if (existingGameDay) {
          const oldGames = await ctx.db
            .query("games")
            .filter(q => q.eq(q.field("gameDayId"), gameDayId))
            .collect();

          for (const game of oldGames) {
            await ctx.db.delete(game._id);
          }
        }

        // Insert new games
        for (const game of dayData.games) {
          await ctx.db.insert("games", {
            gameDayId,
            date: dayData.date,
            ...game
          });
        }

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to import data for date ${dayData.date}: ${error}`);
      }
    }

    return results;
  }
});