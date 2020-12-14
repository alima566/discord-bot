require("module-alias/register");
require("dotenv").config();

const Discord = require("discord.js");
const WOKCommands = require("wokcommands");
const { Player } = require("discord-player");
const fetch = require("node-fetch");

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
});
const player = new Player(client);

client.player = player;
client.queue = new Map();

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // client.user.setActivity("https://www.twitch.tv/kelleebot", {
  //   type: "WATCHING",
  // });
  const daysToChristmas = await getDaysToChristmas();

  client.user.setActivity(
    `${daysToChristmas["Days to Christmas"]} ${
      daysToChristmas !== 1 ? "days" : "day"
    } until Christmas`,
    {
      type: "PLAYING",
    }
  );

  const wok = new WOKCommands(client, "commands", "features", "messages.json")
    .setMongoPath(process.env.MONGO_PATH)
    .setBotOwner("464635440801251328")
    .setColor("#7289da")
    .setCategoryEmoji("AC", "🍀")
    .setCategoryEmoji("Animals", "🐱")
    .setCategoryEmoji("Gambling", "🎰")
    .setCategoryEmoji("Misc", "🎮")
    .setCategoryEmoji("Music", "🎵")
    .setCategoryEmoji("Pokemon", "🍚");

  wok.on("databaseConnected", (connection, state) => {
    console.log("The state is", state);
  });

  wok.on("languageNotSupported", (msg, lang) => {
    console.log("Attempted to set language to", lang);
  });
});

const getDaysToChristmas = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const body = await fetch(
        "https://christmas-days.anvil.app/_/api/get_days"
      );
      const result = body.json();
      if (result) {
        resolve(result);
      } else {
        reject("An error occured.");
      }
    } catch (err) {
      console.log(err);
    }
  });
};

client.login(process.env.DISCORD_TOKEN);
