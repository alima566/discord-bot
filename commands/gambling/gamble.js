const { getGamblingChannel, getPoints, addPoints } = require("@utils/gambling");

module.exports = {
  commands: ["gamble", "roulette"],
  category: "Gambling",
  minArgs: 1,
  maxArgs: 1,
  description: "Users can gamble away the amount of points that they have.",
  expectedArgs: "<The amount you want to gamble>",
  callback: async ({ message, args, instance, client }) => {
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
            client.setTimeout(() => msg.delete(), 1000 * 3);
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

    if (actualPoints === 0) {
      return message.reply(
        instance.messageHandler.get(message.guild, "NO_POINTS")
      );
    }

    if (pointsToGamble.toLowerCase() === "all") {
      if (coinFlip() === 0) {
        const newPoints = await addPoints(guildID, userID, -actualPoints);
        return message.channel.send(
          instance.messageHandler.get(message.guild, "ALL_IN_LOSE", {
            USER: `<@${userID}>`,
          })
        );
      } else {
        const newPoints = await addPoints(guildID, userID, actualPoints);
        return message.channel.send(
          instance.messageHandler.get(message.guild, "ALL_IN_WIN", {
            USER: `<@${userID}>`,
            POINTS: `${newPoints.toLocaleString()}`,
          })
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
      if (coinFlip() === 0) {
        const newPoints = await addPoints(
          guildID,
          userID,
          parseInt(pointsToGamble) * -1
        );
        if (actualPoints === parseInt(pointsToGamble)) {
          return message.channel.send(
            instance.messageHandler.get(message.guild, "ALL_IN_LOSE", {
              USER: `<@${userID}>`,
            })
          );
        } else {
          return message.channel.send(
            `<@${userID}> gambled ${parseInt(
              pointsToGamble
            ).toLocaleString()} and lost ${parseInt(
              pointsToGamble
            ).toLocaleString()} ${
              parseInt(pointsToGamble) !== 1 ? "points" : "point"
            }. They now have ${newPoints.toLocaleString()} ${
              newPoints !== 1 ? "points" : "point"
            }.`
          );
        }
      } else {
        const newPoints = await addPoints(
          guildID,
          userID,
          parseInt(pointsToGamble)
        );
        if (actualPoints === parseInt(pointsToGamble)) {
          return message.channel.send(
            instance.messageHandler.get(message.guild, "ALL_IN_WIN", {
              USER: `<@${userID}>`,
              POINTS: `${newPoints.toLocaleString()}`,
            })
          );
        } else {
          return message.channel.send(
            `<@${userID}> gambled ${parseInt(
              pointsToGamble
            ).toLocaleString()} and won ${parseInt(
              pointsToGamble
            ).toLocaleString()} ${
              parseInt(pointsToGamble) !== 1 ? "points" : "point"
            }! They now have ${newPoints.toLocaleString()} ${
              newPoints !== 1 ? "points" : "point"
            }.`
          );
        }
      }
    }
  },
};

const coinFlip = () => {
  return Math.floor(Math.random() * 2);
};
