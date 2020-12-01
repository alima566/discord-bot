const gambling = require("@utils/gambling");
const numeral = require("numeral");
const gamblingSchema = require("@schemas/gambling-schema");

module.exports = {
  commands: ["points", "balance", "bal"],
  category: "Gambling",
  maxArgs: 1,
  description: "Displays how many points you or another user has.",
  //cooldown: 15,
  requiredChannel: "gambling",
  callback: async (msg) => {
    const gamblingChannelID = "770695220220264448";
    if (msg.channel.id !== `${gamblingChannelID}`) {
      msg
        .reply(`Points can only be checked in <#${gamblingChannelID}>!`)
        .then((message) => {
          message.delete({ timeout: 5000 });
        });
      msg.delete();
      return;
    }

    const target = msg.mentions.users.first() || msg.author;
    const guildID = msg.guild.id;
    const userID = target.id;

    const points = await gambling.getPoints(guildID, userID);
    const ranking = await getRanking(guildID, userID);
    msg.channel.send(
      `${target} has ${numeral(points).format(",")} ${
        points !== 1 ? "points" : "point"
      } and ranks ${ranking}!`
    );
  },
};

const getRanking = async (guildID, userID) => {
  const results = await gamblingSchema.find({ guildID }).sort({ points: -1 });
  for (let count = 0; count < results.length; count++) {
    if (results[count].userID === userID) {
      return `${count + 1} out of ${results.length}`;
    }
  }
};
