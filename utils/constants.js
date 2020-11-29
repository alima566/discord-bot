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

module.exports.sendMessageToBotThings = (client, msgEmbed) => {
  let channel = client.channels.cache.find(
    (c) => c.id === "740349602800205844"
  );
  channel.send(msgEmbed);
};
