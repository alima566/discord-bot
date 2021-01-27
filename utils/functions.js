const botChannelSchema = require("@schemas/bot-channel-schema");

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

const sendMessageToBotThings = async (client, guild, msg) => {
  const result = await botChannelSchema.findOne({ _id: guild.id });
  if (result) {
    const channel = client.channels.cache.get(result.channelID);
    if (channel) {
      channel.send(msg);
    }
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

module.exports = {
  getRandomNumber,
  getMonthsAvailable,
  getTimesAvailable,
  sendMessageToBotThings,
  chunkArray,
  log,
  paginateEmbed,
};
