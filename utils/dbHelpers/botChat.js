const botChatSchema = require("@schemas/bot-chat-schema");

let botChatCache = {};

const setBotChatCache = (guild, channel) => {
  botChatCache[guild.id] = channel.id;
};

const getBotChatChannel = async (guildID) => {
  let channelID = botChatCache[guildID];
  if (!channelID) {
    const result = await botChatSchema.findById(guildID);
    if (!result) return;

    channelID = result.channelID;
    botChatCache[guildID] = channelID;
  }
  return channelID;
};

module.exports = {
  setBotChatCache,
  getBotChatChannel,
};
