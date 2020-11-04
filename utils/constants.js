const BOT_COMMAND_RESPONSES = {
  aaronHug: [
    "Aaron runs away because <username> just tried to hug him! No hugging Aaron allowed!",
    "Aaron requests that <username> stay at least 6 feet away from him during these times. Hug rejected.",
    "Did you really just try to hug Aaron? You wanna get banned?",
    "Aaron is social distancing and does not want <username> invading his bubble. Please do not try to hug him again.",
  ],
};

module.exports = {
  BOT_COMMAND_RESPONSES: BOT_COMMAND_RESPONSES,
  PREFIX: `!`,
  getRandomIntInclusive: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  },
  getMonthsAvailable: function (hemisphere) {
    let avail = "";
    hemisphere.forEach((hem) => {
      avail += hem.months + "\n";
    });
    return avail;
  },
  getTimesAvailable: function (hemisphere) {
    let avail = "";
    hemisphere.forEach((hem) => {
      avail += hem.time + "\n";
    });
    return avail;
  },
  sendMessageToBotThings: function (client, msgEmbed) {
    let channel = client.channels.cache.find(
      (c) => c.id === "740349602800205844"
    );
    channel.send(msgEmbed);
  },
};
