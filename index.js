require("module-alias/register");
require("dotenv").config();

const Discord = require("discord.js");
const WOKCommands = require("wokcommands");
const { Player } = require("discord-player");

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
});
const player = new Player(client);

client.player = player;
client.queue = new Map();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("https://www.twitch.tv/kelleebot", {
    type: "WATCHING",
  });
  new WOKCommands(client, "commands", "features")
    .setSyntaxError(
      "Incorrect syntax. Please use `{PREFIX}{COMMAND} {ARGUMENTS}`."
    )
    .setMongoPath(process.env.MONGO_PATH)
    .setColor("#7289da")
    .setCategoryEmoji("AC", "🍀")
    .setCategoryEmoji("Animals", "🐱")
    .setCategoryEmoji("Gambling", "🎰")
    .setCategoryEmoji("Misc", "🎮")
    .setCategoryEmoji("Music", "🎵")
    .setCategoryEmoji("Pokemon", "🍚");
});

client.login(process.env.DISCORD_TOKEN);
