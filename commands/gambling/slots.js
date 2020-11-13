const gambling = require("@utils/gambling");
const numeral = require("numeral");
const constants = require("@utils/constants");

const slotsEmoji = ["💰", "✨", "💩", "🔥"];

module.exports = {
  commands: ["slots", "slot"],
  minArgs: 1,
  maxArgs: 1,
  description: "Users can gamble away the amount of points that they have.",
  expectedArgs: "<The amount you want to gamble>",
  cooldown: 60 * 2.5,
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

    const target = msg.mentions.users.first() || msg.author;
    const guildID = msg.guild.id;
    const userID = target.id;

    const pointsToGamble = args[0];
    const actualPoints = await gambling.getPoints(guildID, userID);

    const slot1 = constants.getRandomIntInclusive(0, slotsEmoji.length - 1);
    const slot2 = constants.getRandomIntInclusive(0, slotsEmoji.length - 1);
    const slot3 = constants.getRandomIntInclusive(0, slotsEmoji.length - 1);
    const text = `<@${userID}> spun ${slotsEmoji[slot1]} | ${slotsEmoji[slot2]} | ${slotsEmoji[slot3]}`;

    if (actualPoints === 0) {
      msg.channel.send(`You don't have any points to gamble.`);
      return;
    }

    if (pointsToGamble.toLowerCase() === "all") {
      if (slot1 === slot2 && slot2 === slot3) {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          actualPoints * 2
        );
        msg.channel.send(
          `${text} and won ${numeral(actualPoints * 2).format(",")} ${
            newPoints > 1 || newPoints === 0 ? "points" : "point"
          }! They now have ${numeral(newPoints).format(",")} ${
            newPoints > 1 || newPoints === 0 ? "points" : "point"
          }.`
        );
        return;
      } else {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          actualPoints * -1
        );
        msg.channel.send(`${text} and lost all of their points :sob:`);
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
      if (slot1 === slot2 && slot2 === slot3) {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          pointsToGamble * 2
        );
        msg.channel.send(
          `${text} and won ${numeral(pointsToGamble * 2).format(",")} ${
            newPoints > 1 || newPoints === 0 ? "points" : "point"
          }! They now have ${numeral(newPoints).format(",")} ${
            newPoints > 1 || newPoints === 0 ? "points" : "point"
          }.`
        );
        return;
      } else {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          pointsToGamble * -1
        );
        msg.channel.send(
          `${text} and lost ${numeral(pointsToGamble).format(",")} ${
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
