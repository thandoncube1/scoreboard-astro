// schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// We create a schema that represents a collection of games for each day
export default defineSchema({
  // Main table to store game days
  gameDays: defineTable({
    date: v.string(), // YYYY-MM-DD format
    gamesCount: v.number(),
    status: v.string(), // 'completed' | 'in_progress'
    lastUpdated: v.number() // timestamp
  }),

  // Table to store individual game details
  games: defineTable({
    gameDayId: v.id('gameDays'), // Reference to the parent gameDay
    date: v.string(),
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
});