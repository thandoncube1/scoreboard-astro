import { ConvexClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const client = new ConvexClient(process.env["CONVEX_URL"]);

client.query(api.games.get).then(console.log);