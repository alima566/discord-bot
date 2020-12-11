const { MessageEmbed } = require("discord.js");
const backlogRedemptionSchema = require("@schemas/backlog-redemptions-schema");

const statusMessages = {
  WAITING: {
    text: "⏱️ Waiting to be completed.",
    color: 0xffea00,
  },
  COMPLETED: {
    text: "✅ Redemption completed.",
    color: 0x34eb5b,
  },
  REJECTED: {
    text: "❌ Redemption rejected or not completed.",
    color: 0x20808,
  },
};

let redemptionCache = {};

const fetchRedemptionChannels = async (guildID) => {
  let query = {};

  if (guildID) {
    query._id = guildID;
  }

  const results = await backlogRedemptionSchema.find(query);
  for (const result of results) {
    const { _id, channelID } = result;
    redemptionCache[_id] = channelID;
  }
};

module.exports = (client) => {
  fetchRedemptionChannels();

  client.on("message", (msg) => {
    const { guild, channel, content, member } = msg;
    const cachedChannelID = redemptionCache[guild.id];
    if (cachedChannelID && cachedChannelID === channel.id && !member.user.bot) {
      msg.delete();

      const status = statusMessages.WAITING;
      const msgEmbed = new MessageEmbed()
        .setColor(status.color)
        .setAuthor(member.displayName, member.user.displayAvatarURL())
        .setDescription(content)
        .addFields({
          name: "**Status**",
          value: status.text,
        })
        .setTimestamp();

      channel.send(msgEmbed);
    }
  });
};

module.exports.fetchRedemptionChannels = fetchRedemptionChannels;

module.exports.statusMessages = statusMessages;

module.exports.redemptionCache = () => {
  return redemptionCache;
};
