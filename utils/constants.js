const botChannelSchema = require("@schemas/bot-channel-schema");

module.exports.getRandomNumber = (array) => {
  return Math.floor(Math.random() * array.length);
};

module.exports.getMonthsAvailable = (hemisphere) => {
  let avail = "";
  hemisphere.availability_array.forEach((hem) => {
    avail += hem.months + "\n";
  });
  return avail;
};

module.exports.getTimesAvailable = (hemisphere) => {
  let avail = "";
  hemisphere.availability_array.forEach((hem) => {
    avail += hem.time + "\n";
  });
  return avail;
};

module.exports.sendMessageToBotThings = async (client, guild, msgEmbed) => {
  const results = await botChannelSchema.find({ _id: guild.id });
  for (const result of results) {
    const { _id: guildID, channelID } = result;
    const guild = client.guilds.cache.get(guildID);
    if (guild) {
      const channel = client.channels.cache.get(channelID);
      if (channel) {
        channel.send(msgEmbed);
      }
    }
  }
};
