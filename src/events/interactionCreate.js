const { Events } = require("discord.js");
const CustomClient = require("../Client");

const eventInformation = {
  name: Events.InteractionCreate,
  once: false,
};

/**
 * Event callback for the 'clientReady' event, when the client is prepared.
 * NOTE: This event has been changed from 'client' to 'clientReady' in discord.js v14.
 * @param {CustomClient} client
 * @param {import("discord.js").Interaction} interaction
 */
const eventCallback = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}`);
    console.error(error);
    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    } catch (err) {
      console.error("Failed to notify user about the command error:", err);
    }
  }
};

module.exports = {
  eventInformation,
  eventCallback,
};
