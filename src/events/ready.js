const { Events } = require("discord.js");
const CustomClient = require("../Client");

const eventInformation = {
  name: Events.ClientReady,
  once: true,
};

/**
 * Event callback for the 'clientReady' event, when the client is prepared.
 * NOTE: This event has been changed from 'client' to 'clientReady' in discord.js v14.
 * @param {CustomClient} client
 * @param  {...any} callbackParams
 */
const eventCallback = (client, ...callbackParams) => {
  //The ...callbackParams is the Client discord.js provides, but you get the CustomClient for better typing^.
  console.log("-------------------------------------");
  console.log("Discord.JS Base " + process.env.DJS_BASE_VERSION_STR);
  console.log(`Logged in as ${client.user.tag}!`);
  console.log("-------------------------------------");
};

module.exports = {
  eventInformation,
  eventCallback,
};
