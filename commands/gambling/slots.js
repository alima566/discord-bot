const { getGamblingChannel, getPoints, addPoints } = require("@utils/gambling");
const { getRandomNumber } = require("@utils/functions");

const slotsEmoji = [
  "750956567666491393", // kellee1Star
  "750956642459189289", // kellee2Star
  "750956774810583103", // kellee3Star
  "750956822755541012", // kellee4Star
]; //["💰", "✨", "💩", "🔥"];
const multiplier = slotsEmoji.length;

module.exports = {
  commands: ["slots", "slot"],
  category: "Gambling",
  minArgs: 1,
  maxArgs: 1,
  description: `Play the slots and test your luck. Each slot win gives you ${multiplier} times the amount you bet.`,
  expectedArgs: "<The amount you want to gamble>",
  callback: async ({ message, args, client, instance }) => {
    const target = message.author;
    const channelID = message.channel.id;
    const guildID = message.guild.id;
    const userID = target.id;
    const gamblingChannel = await getGamblingChannel(guildID);

    if (gamblingChannel !== null) {
      if (channelID !== gamblingChannel) {
        message
          .reply(`Gambling is only allowed in <#${gamblingChannel}>!`)
          .then((msg) => {
            msg.delete({ timeout: 5000 });
          });
        message.delete();
        return;
      }
    } else {
      return message.reply(
        `A gambling channel needs to be set first in order for this command to be used.`
      );
    }

    const pointsToGamble = args[0].trim();
    const actualPoints = await getPoints(guildID, userID);

    const slot1 = getRandomNumber(slotsEmoji);
    const slot2 = getRandomNumber(slotsEmoji);
    const slot3 = getRandomNumber(slotsEmoji);

    const emote1 = client.emojis.cache.get(slotsEmoji[slot1]);
    const emote2 = client.emojis.cache.get(slotsEmoji[slot2]);
    const emote3 = client.emojis.cache.get(slotsEmoji[slot3]);

    const slotsText = `<@${userID}> spun ${emote1} | ${emote2} | ${emote3}`;

    if (actualPoints === 0) {
      return message.reply(
        instance.messageHandler.get(message.guild, "NO_POINTS")
      );
    }

    if (pointsToGamble.toLowerCase() === "all") {
      if (slot1 === slot2 && slot2 === slot3) {
        const newPoints = await addPoints(
          guildID,
          userID,
          actualPoints * multiplier
        );
        return message.channel.send(
          `${slotsText} and won ${parseInt(
            actualPoints * multiplier
          ).toLocaleString()} ${
            newPoints !== 1 ? "points" : "point"
          }! They now have ${newPoints.toLocaleString()} ${
            newPoints !== 1 ? "points" : "point"
          }.`
        );
      } else {
        const newPoints = await addPoints(guildID, userID, actualPoints * -1);
        return message.channel.send(
          `${slotsText} and lost all of their points :sob:`
        );
      }
    } else if (isNaN(pointsToGamble)) {
      return message.reply(
        instance.messageHandler.get(message.guild, "VALID_POINTS")
      );
    } else if (pointsToGamble < 1) {
      return message.reply(
        instance.messageHandler.get(message.guild, "ONE_POINT")
      );
    } else if (pointsToGamble > actualPoints) {
      return message.reply(
        `you don't have enough points! You only have ${actualPoints.toLocaleString()} ${
          actualPoints !== 1 ? "points" : "point"
        }!`
      );
    } else {
      if (slot1 === slot2 && slot2 === slot3) {
        const newPoints = await addPoints(
          guildID,
          userID,
          parseInt(pointsToGamble) * multiplier
        );
        return message.channel.send(
          `${slotsText} and won ${parseInt(
            pointsToGamble * multiplier
          ).toLocaleString()} ${
            newPoints !== 1 ? "points" : "point"
          }! They now have ${newPoints.toLocaleString()} ${
            newPoints !== 1 ? "points" : "point"
          }.`
        );
      } else {
        const newPoints = await addPoints(
          guildID,
          userID,
          parseInt(pointsToGamble) * -1
        );
        return message.channel.send(
          `${slotsText} and lost ${parseInt(pointsToGamble).toLocaleString()} ${
            parseInt(pointsToGamble) !== 1 ? "points" : "point"
          }! They now have ${newPoints.toLocaleString()} ${
            newPoints !== 1 ? "points" : "point"
          }.`
        );
      }
    }
  },
};
