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
  const result = await botChannelSchema.findOne({ _id: guild.id });
  if (result) {
    const channel = client.channels.cache.get(result.channelID);
    if (channel) {
      channel.send(msgEmbed);
    }
  }
};
