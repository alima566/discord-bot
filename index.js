require("module-alias/register");
require("dotenv").config();

const Discord = require("discord.js");
const WOKCommands = require("wokcommands");
const { Player } = require("discord-player");
const { log } = require("@utils/functions");

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  allowedMentions: { parse: ["users", "roles"] },
});

client.player = new Player(client);

client.on("ready", async () => {
  log("SUCCESS", "./index.js", `Logged in as ${client.user.tag}!`);
  client.user.setActivity("https://www.twitch.tv/kelleebot", {
    type: "WATCHING",
  });

  const messagesPath = "messages.json";
  const wok = new WOKCommands(client, {
    commandsDir: "commands",
    featuresDir: "features",
    messagesPath,
    showWarns: false,
    del: 3,
    testServers: ["785593545187917824"],
  })
    .setMongoPath(process.env.MONGO_PATH)
    .setBotOwner("464635440801251328")
    .setColor("#DFBCF5")
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
});

client.login(process.env.DISCORD_TOKEN);
