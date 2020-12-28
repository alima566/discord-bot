const botChannelSchema = require("@schemas/bot-channel-schema");

const consoleColors = {
  SUCCESS: "\u001b[32m",
  WARNING: "\u001b[33m",
  ERROR: "\u001b[31m",
};

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

module.exports.sendMessageToBotThings = async (client, guild, msg) => {
  const result = await botChannelSchema.findOne({ _id: guild.id });
  if (result) {
    const channel = client.channels.cache.get(result.channelID);
    if (channel) {
      channel.send(msg);
    }
  }
};

module.exports.log = (type, path, text) => {
  console.log(
    `\u001b[36;1m<KelleeBot>\u001b[0m\u001b[34m [${path}]\u001b[0m - ${consoleColors[type]}${text}\u001b[0m`
  );
};
