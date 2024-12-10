import * as dotenv from "@std/dotenv";

// Load environment variables
const env = await dotenv.load();
const CONVEX_URL = env["CONVEX_URL"] || "";
const CONVEX_DEPLOY_KEY = env["CONVEX_DEPLOY_KEY"] || "";

if (!CONVEX_URL || !CONVEX_DEPLOY_KEY) {
  console.error("Please set CONVEX_URL and CONVEX_DEPLOY_KEY in .env file");
  Deno.exit(1);
}

async function importDataToConvex(jsonFilePath: string) {
  try {
    // Read and parse the JSON file
    const jsonContent = await Deno.readTextFile(jsonFilePath);
    const jsonData = JSON.parse(jsonContent);

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
        "Authorization": `Bearer ${CONVEX_DEPLOY_KEY}`,
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