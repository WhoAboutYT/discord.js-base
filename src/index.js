const dotenv = require("dotenv");
const path = require("node:path");

dotenv.config();

const CustomClient = require("./Client");
const { GatewayIntentBits } = require("discord.js");

(async () => {
  try {
    const client = new CustomClient({ intents: [GatewayIntentBits.Guilds] });

    await client.commandHandler(path.join(__dirname, "commands"));
    await client.eventHandler(path.join(__dirname, "events"));

    const token = process.env.TOKEN;
    if (!token) {
      console.error(
        "Missing environment variable: TOKEN. Set TOKEN in your .env file."
      );
      process.exit(1);
    }

    await client.login(token);
  } catch (err) {
    console.error("Failed to start the client:", err);
    process.exit(1);
  }
})();
