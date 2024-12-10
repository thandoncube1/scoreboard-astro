import * as dotenv from "@std/dotenv";
import { z } from "npm:zod";

// Schema Information
// Define the schema that matches your Convex data structure
const LineScoresSchema = z.object({
    fstQuarter: z.string(),
    sndQuarter: z.string(),
    trdQuarter: z.string(),
    fthQuarter: z.string(),
    final: z.string()
  });

  const TeamSchema = z.object({
    name: z.string(),
    lineScores: LineScoresSchema
  });

  const GameSchema = z.object({
    _uuid: z.string(),
    title: z.string(),
    url: z.string(),
    backgroundImage: z.string().optional(),
    gameBook: z.string().optional(),
    homeTeam: TeamSchema,
    awayTeam: TeamSchema
  });

  const GameDaySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Validates YYYY-MM-DD format
    games: z.array(GameSchema)
  });

const ImportSchema = z.array(GameDaySchema);

type ValidatedGameData = z.infer<typeof ImportSchema>;

// Load environment variables
const env = await dotenv.load();
const CONVEX_URL = env["CONVEX_URL"] || "";
const CONVEX_DEPLOYMENT = env["CONVEX_DEPLOYMENT"] || "";

if (!CONVEX_URL || !CONVEX_DEPLOYMENT) {
  console.error("Please set CONVEX_URL and CONVEX_DEPLOY_KEY in .env file");
  Deno.exit(1);
}

async function importDataToConvex(jsonContent: unknown): Promise<ValidatedGameData> {
  try {
    // Read and parse the JSON file
    const stringifiedJSON = JSON.stringify(jsonContent);
    const jsonData = JSON.parse(stringifiedJSON);

    // Prepare the mutation request
    const mutation = {
      arguments: [{ jsonData }],
      // Replace with your actual mutation name from Convex
      fnName: "mutations:importGamesFromJSON",
    };

    // Make the API request
    const response = await fetch(`${CONVEX_URL}/mutation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CONVEX_DEPLOYMENT}`,
      },
      body: JSON.stringify(mutation),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Import Results:", result);
    return result;

  } catch (error) {
    console.error("Error importing data:", error);
    throw error;
  }
}

// CLI interface
if (import.meta.main) {
  const filePath = Deno.args[0];

  if (!filePath) {
    console.error("Please provide a JSON file path");
    console.log("Usage: deno run --allow-read --allow-net --allow-env import_data.ts <path-to-json>");
    Deno.exit(1);
  }

  try {
    await importDataToConvex(filePath);
    console.log("Data import completed successfully");
  } catch (error) {
    console.error("Import failed:", error);
    Deno.exit(1);
  }
}

// Export for use as a module
export { importDataToConvex };