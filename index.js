require("module-alias/register");
require("dotenv").config();

const Discord = require("discord.js");
const WOKCommands = require("wokcommands");
const { Player } = require("discord-player");
const { log } = require("@utils/functions");

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
});
const player = new Player(client);

client.player = player;
client.queue = new Map();

client.on("ready", async () => {
  log("SUCCESS", "./index.js", `Logged in as ${client.user.tag}!`);
  client.user.setActivity("https://www.twitch.tv/kelleebot", {
    type: "WATCHING",
  });

  const messagesPath = "messages.json";
  const wok = new WOKCommands(client, {
    commandsDir: "commands",
    featureDir: "features",
    messagesPath,
    showWarns: false,
    del: 3,
    testServers: ["785593545187917824"],
  })
    .setMongoPath(process.env.MONGO_PATH)
    .setBotOwner("464635440801251328")
    .setColor("#7289da")
    .setCategorySettings([
      {
        name: "Configuration",
        emoji: "⚙️",
        hidden: true,
      },
      {
        name: "Help",
        emoji: "❓",
        hidden: true,
      },
      {
        name: "AC",
        emoji: "🍀",
      },
      {
        name: "Animals",
        emoji: "🐱",
      },
      {
        name: "Fun",
        emoji: "🎮",
      },
      {
        name: "Gambling",
        emoji: "🎰",
      },
      {
        name: "Info",
        emoji: "❗",
      },
      {
        name: "Misc",
        emoji: "💡",
      },
      {
        name: "Music",
        emoji: "🎵",
      },
      {
        name: "Pokemon",
        emoji: "🍚",
      },
      {
        name: "Genshin",
        emoji: "⚔️",
      },
    ]);

  wok.on("databaseConnected", (connection, state) => {
    log(
      state === "Connected"
        ? "SUCCESS"
        : state === "Disconnected"
        ? "ERROR"
        : "WARNING",
      "./index.js",
      state
    );
  });

  wok.on("languageNotSupported", (msg, lang) => {
    log("WARNING", "./index.js", `Attempted to set language to ${lang}`);
  });
});

client.login(process.env.DISCORD_TOKEN);
