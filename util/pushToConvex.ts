const GameDetailJSON = await import("../data/data-detail-game.json", { with: { type: "json"}});
import { importDataToConvex } from "../server/deno/model.ts";

// Import to convex DB
const result = await importDataToConvex(GameDetailJSON);
console.log("Result [Convex]: ", result);