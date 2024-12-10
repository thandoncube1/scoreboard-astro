import { query } from "./_generated/server.js";
import { v } from "convex/values";

// Get all game days, ordered by date
export const getAllGameDays = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("gameDays")
      .order("desc")
      .collect();
  }
});

// Get a specific game day and its games by date
export const getGameDayByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const gameDay = await ctx.db
      .query("gameDays")
      .filter(q => q.eq(q.field("date"), args.date))
      .first();

    if (!gameDay) return null;

    const games = await ctx.db
      .query("games")
      .filter(q => q.eq(q.field("gameDayId"), gameDay._id))
      .collect();

    return {
      ...gameDay,
      games
    };
  }
});

// Get games for a specific team
export const getGamesByTeam = query({
  args: { teamName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("games")
      .filter(q =>
        q.or(
          q.eq(q.field("homeTeam.name"), args.teamName),
          q.eq(q.field("awayTeam.name"), args.teamName)
        )
      )
      .order("desc")
      .collect();
  }
});

// Get recent games with pagination
export const getRecentGames = query({
  args: {
    limit: v.number(),
    cursor: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("games")
      .order("desc")
      .limit(args.limit);

    if (args.cursor) {
      query.filter(q => q.gt(q.field("date"), args.cursor));
    }

    return await query.collect();
  }
});

// Get game details by UUID
export const getGameByUUID = query({
  args: { uuid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("games")
      .filter(q => q.eq(q.field("_uuid"), args.uuid))
      .first();
  }
});