const gambling = require("@utils/gambling");
const numeral = require("numeral");
module.exports = {
  commands: ["gamble", "roulette"],
  minArgs: 1,
  maxArgs: 1,
  description: "Users can gamble away the amount of points that they have.",
  expectedArgs: "<The amount you want to gamble>",
  //cooldown: 60 * 2.5,
  requiredChannel: "gambling",
  callback: async (msg, args) => {
    const gamblingChannelID = "770695220220264448";
    if (msg.channel.id !== `${gamblingChannelID}`) {
      msg
        .reply(`Gambling is only allowed in <#${gamblingChannelID}>!`)
        .then((message) => {
          message.delete({ timeout: 5000 });
        });
      msg.delete();
      return;
    }

    const target = msg.author;
    const guildID = msg.guild.id;
    const userID = target.id;

    const pointsToGamble = args[0];
    const actualPoints = await gambling.getPoints(guildID, userID);

    if (actualPoints === 0) {
      msg.channel.send(`You don't have any points to gamble.`);
      return;
    }

    if (pointsToGamble.toLowerCase() === "all") {
      if (coinFlip() === 0) {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          -actualPoints
        );
        msg.channel.send(
          `<@${userID}> went all in and lost all of their points :sob:`
        );
        return;
      } else {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          actualPoints
        );
        msg.channel.send(
          `<@${userID}> went all in and won! They now have ${numeral(
            newPoints
          ).format(",")} points!`
        );
        return;
      }
    } else if (isNaN(pointsToGamble)) {
      msg.channel.send(`Please provide a valid number of points.`);
      return;
    } else if (pointsToGamble < 1) {
      msg.channel.send(`You must gamble at least 1 point!`);
      return;
    } else if (pointsToGamble > actualPoints) {
      return msg.reply(
        `you don't have enough points! You only have ${numeral(
          actualPoints
        ).format(",")} ${
          actualPoints > 1 || actualPoints === 0 ? "points" : "point"
        }!`
      );
    } else {
      if (coinFlip() === 0) {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          -pointsToGamble
        );
        msg.channel.send(
          `<@${userID}> gambled ${numeral(pointsToGamble).format(
            ","
          )} and lost ${numeral(pointsToGamble).format(",")} ${
            pointsToGamble > 1 || pointsToGamble === 0 ? "points" : "point"
          }. They now have ${numeral(newPoints).format(",")} ${
            newPoints > 1 || newPoints === 0 ? "points" : "point"
          }.`
        );
        return;
      } else {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          pointsToGamble
        );
        msg.channel.send(
          `<@${userID}> gambled ${numeral(pointsToGamble).format(
            ","
          )} and won ${numeral(pointsToGamble).format(",")} ${
            pointsToGamble > 1 || pointsToGamble === 0 ? "points" : "point"
          }! They now have ${numeral(newPoints).format(",")} ${
            newPoints > 1 || newPoints === 0 ? "points" : "point"
          }.`
        );
        return;
      }
    }
  },
};

const coinFlip = () => {
  return Math.floor(Math.random() * 2);
};
