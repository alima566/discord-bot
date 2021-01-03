const gambling = require("@utils/gambling");
const numeral = require("numeral");
const { getRandomNumber } = require("@utils/functions");

const slotsEmoji = ["kellee1Star", "kellee2Star", "kellee3Star", "kellee4Star"]; //["💰", "✨", "💩", "🔥"];
const multiplier = slotsEmoji.length;

const getEmoji = (msg, emoteName) => {
  return msg.guild.emojis.cache.find((e) => e.name === emoteName);
};

module.exports = {
  commands: ["slots", "slot"],
  category: "Gambling",
  minArgs: 1,
  maxArgs: 1,
  description: "Users can gamble away the amount of points that they have.",
  expectedArgs: "<The amount you want to gamble>",
  //cooldown: 60 * 2.5,
  requiredChannel: "gambling",
  callback: async ({ message, args, instance }) => {
    const target = message.author;
    const channelID = message.channel.id;
    const guildID = message.guild.id;
    const userID = target.id;
    const gamblingChannel = await gambling.getGamblingChannel(guildID);

    if (gamblingChannel !== null) {
      if (channelID !== gamblingChannel) {
        message
          .reply(`Gambling is only allowed in <#${gamblingChannel}>!`)
          .then((message) => {
            message.delete({ timeout: 5000 });
          });
        message.delete();
        return;
      }
    } else {
      message.reply(
        `A gambling channel needs to be set first in order for this command to be used.`
      );
      return;
    }

    const pointsToGamble = args[0];
    const actualPoints = await gambling.getPoints(guildID, userID);

    const slot1 = getRandomNumber(slotsEmoji);
    const slot2 = getRandomNumber(slotsEmoji);
    const slot3 = getRandomNumber(slotsEmoji);

    const emote1 = getEmoji(message, slotsEmoji[slot1]);
    const emote2 = getEmoji(message, slotsEmoji[slot2]);
    const emote3 = getEmoji(message, slotsEmoji[slot3]);

    const slotsText = `<@${userID}> spun ${emote1} | ${emote2} | ${emote3}`;

    if (actualPoints === 0) {
      message.reply(instance.messageHandler.get(message.guild, "NO_POINTS"));
      return;
    }

    if (pointsToGamble.toLowerCase() === "all") {
      if (slot1 === slot2 && slot2 === slot3) {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          actualPoints * multiplier
        );
        message.channel.send(
          `${slotsText} and won ${numeral(actualPoints * multiplier).format(
            ","
          )} ${newPoints !== 1 ? "points" : "point"}! They now have ${numeral(
            newPoints
          ).format(",")} ${newPoints !== 1 ? "points" : "point"}.`
        );
        return;
      } else {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          actualPoints * -1
        );
        return message.channel.send(
          `${slotsText} and lost all of their points :sob:`
        );
      }
    } else if (isNaN(pointsToGamble)) {
      return message.reply(`Please provide a valid number of points.`);
    } else if (pointsToGamble < 1) {
      return message.reply(`You must gamble at least 1 point!`);
    } else if (pointsToGamble > actualPoints) {
      return message.reply(
        `you don't have enough points! You only have ${numeral(
          actualPoints
        ).format(",")} ${actualPoints !== 1 ? "points" : "point"}!`
      );
    } else {
      if (slot1 === slot2 && slot2 === slot3) {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          parseInt(pointsToGamble) * multiplier
        );
        message.channel.send(
          `${slotsText} and won ${numeral(pointsToGamble * multiplier).format(
            ","
          )} ${newPoints !== 1 ? "points" : "point"}! They now have ${numeral(
            newPoints
          ).format(",")} ${newPoints !== 1 ? "points" : "point"}.`
        );
        return;
      } else {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          parseInt(pointsToGamble) * -1
        );
        message.channel.send(
          `${slotsText} and lost ${numeral(pointsToGamble).format(",")} ${
            parseInt(pointsToGamble) !== 1 ? "points" : "point"
          }! They now have ${numeral(newPoints).format(",")} ${
            newPoints !== 1 ? "points" : "point"
          }.`
        );
        return;
      }
    }
  },
};
