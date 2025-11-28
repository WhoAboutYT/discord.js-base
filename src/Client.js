const Discord = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

class CustomClient extends Discord.Client {
  /**
   * Initialize a new Discord Client with the specific discord client options.
   * @param {Discord.ClientOptions} discordClientOptions
   */
  constructor(discordClientOptions) {
    super(discordClientOptions);

    this.init();

    this.commands = new Discord.Collection(); // <string>, <Object> (Command)
  }

  /**
   * Loads commands from a specified directory or the fallback directory (src/commands).
   * Note: Some of the code in this function was adopted form the discord.js guide.
   * @param {string} [commandsPath=path.join(__dirname, 'commands')] - The path to the commands directory.
   */
  async commandHandler(commandsPath = path.join(__dirname, "commands")) {
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        this.commands.set(command.data.name, command);
        console.log("[COMMAND LOADED] " + file);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  /**
   * Loads events from a specified directory or the fallback directory (src/events).
   * @param {string} [eventsPath=path.join(__dirname, 'events')] - The path to the events directory.
   */
  async eventHandler(eventsPath = path.join(__dirname, "events")) {
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));

    let amountLoaded = 0;
    const eventFilesLength = eventFiles.length;

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const { eventInformation, eventCallback } = require(filePath);
      if (eventInformation.once) {
        this.once(eventInformation.name, (...args) =>
          eventCallback(this, ...args)
        );
        amountLoaded++;
        console.log(
          "[EVENT LOADED] " +
            file +
            ` (${amountLoaded}/${eventFilesLength}). (ONCE)`
        );
      } else {
        this.on(eventInformation.name, (...args) =>
          eventCallback(this, ...args)
        );
        amountLoaded++;
        console.log(
          "[EVENT LOADED] " + file + ` (${amountLoaded}/${eventFilesLength})`
        );
      }
    }
  }

  async init() {
    //If you need to do anything before event & command handling you can do it here.
  }
}

module.exports = CustomClient;
