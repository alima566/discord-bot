require("module-alias/register");
require("dotenv").config();

const Discord = require("discord.js");
const WOKCommands = require("wokcommands");

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.commands = new Discord.Collection();
client.queue = new Map();
const queue = new Map();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("https://www.twitch.tv/kelleebot", {
    type: "WATCHING",
  });
  new WOKCommands(client, "commands", "features")
  .setSyntaxError("Incorrect syntax. Please use {PREFIX}{COMMAND} {ARGUMENTS}.")
  .setMongoPath(
    process.env.MONGO_PATH
  );
});

client.login(process.env.DISCORD_TOKEN);
