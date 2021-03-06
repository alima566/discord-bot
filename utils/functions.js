const { Permissions } = require("discord.js");
const botChannelSchema = require("@schemas/bot-channel-schema");
const { botLoggingCache } = require("@root/config.json");

const reactions = ["⏪", "⏸️", "⏩"];
const consoleColors = {
  SUCCESS: "\u001b[32m",
  WARNING: "\u001b[33m",
  ERROR: "\u001b[31m",
};

const getRandomNumber = (array) => {
  return Math.floor(Math.random() * array.length);
};

const getMonthsAvailable = (hemisphere) => {
  let avail = "";
  hemisphere.availability_array.forEach((hem) => {
    avail += hem.months + "\n";
  });
  return avail;
};

const getTimesAvailable = (hemisphere) => {
  let avail = "";
  hemisphere.availability_array.forEach((hem) => {
    avail += hem.time + "\n";
  });
  return avail;
};

const sendMessageToBotLog = async (client, guild, msg) => {
  let channelID = botLoggingCache[guild.id];
  if (!channelID) {
    const result = await botChannelSchema.findById(guild.id);
    if (!result) return;

    channelID = result.channelID;
    botLoggingCache[guild.id] = channelID;
  }

  const channel = client.channels.cache.get(channelID);
  if (channel) {
    channel.send(msg);
  }
};

const paginateEmbed = async (msg, embeds, options) => {
  const pageMsg = await msg.channel.send({ embed: embeds[0] });

  let stop = false;

  for (const emote of reactions) {
    if (stop) return;
    await pageMsg.react(emote).catch((e) => {
      stop = true;
    });
  }

  let pageIndex = 0;
  let time = 30000;
  const filter = (reaction, user) => {
    return reactions.includes(reaction.emoji.name) && user.id === msg.author.id;
  };

  if (options) {
    if (options.time) time = options.time;
  }

  if (pageMsg.deleted) return;

  const collector = pageMsg.createReactionCollector(filter, { time: time });
  collector.on("collect", (reaction, user) => {
    reaction.users.remove(user);
    if (reaction.emoji.name === "⏩") {
      if (pageIndex < embeds.length - 1) {
        pageIndex++;
        pageMsg.edit({ embed: embeds[pageIndex] });
      } else {
        pageIndex = 0;
        pageMsg.edit({ embed: embeds[pageIndex] });
      }
    } else if (reaction.emoji.name === "⏸️") {
      collector.stop();
    } else if (reaction.emoji.name === "⏪") {
      if (pageIndex > 0) {
        pageIndex--;
        pageMsg.edit({ embed: embeds[pageIndex] });
      } else {
        pageIndex = embeds.length - 1;
        pageMsg.edit({ embed: embeds[pageIndex] });
      }
    }
  });

  collector.on("end", () => {
    if (pageMsg.deleted) return;
    pageMsg.reactions.removeAll().catch((err) => console.log(err));
  });
};

const chunkArray = (arr, size) => {
  return arr.length > size
    ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
    : [arr];
};

const log = (type, path, text) => {
  console.log(
    `\u001b[36;1m<KelleeBot>\u001b[0m\u001b[34m [${path}]\u001b[0m - ${consoleColors[type]}${text}\u001b[0m`
  );
};

const fetchAuditLog = async (guild, auditLogAction) => {
  if (guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) {
    return await guild.fetchAuditLogs({
      limit: 1,
      type: auditLogAction,
    });
  }
};

const guildIcon = (guild) => {
  return guild.iconURL()
    ? guild.iconURL({ dynamic: true })
    : "https://i.imgur.com/XhpH3KD.png"; //"https://i.imgur.com/2rWkqIA.png";
};

const msToTime = (ms) => {
  const duration = new Date(ms).toISOString().slice(11, -5);
  return duration.charAt(0) === "0" && duration.charAt(1) === "0"
    ? duration.slice(3)
    : duration;
};

module.exports = {
  getRandomNumber,
  getMonthsAvailable,
  getTimesAvailable,
  sendMessageToBotLog,
  chunkArray,
  log,
  paginateEmbed,
  fetchAuditLog,
  guildIcon,
  msToTime,
};
