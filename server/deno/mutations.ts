// mutations.ts
import { mutation } from "../../convex/_generated/server";
import { v } from "convex/values";

// Mutation to save or update a game day and its games
export const saveGameDay = mutation({
  args: {
    date: v.string(),
    games: v.array(
      v.object({
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
  },
  handler: async (ctx, args) => {
    // Check if we already have a game day for this date
    const existingGameDay = await ctx.db
      .query("gameDays")
      .filter(q => q.eq(q.field("date"), args.date))
      .first();

    // Create or update the game day
    const gameDayId = existingGameDay
      ? existingGameDay._id
      : await ctx.db.insert("gameDays", {
          date: args.date,
          gamesCount: args.games.length,
          status: "completed",
          lastUpdated: Date.now()
        });

    // If updating, remove old games for this day
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
    for (const game of args.games) {
      await ctx.db.insert("games", {
        gameDayId,
        date: args.date,
        ...game
      });
    }

    return gameDayId;
  }
});