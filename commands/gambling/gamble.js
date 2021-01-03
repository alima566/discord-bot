const gambling = require("@utils/gambling");
const numeral = require("numeral");

module.exports = {
  commands: ["gamble", "roulette"],
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

    if (actualPoints === 0) {
      message.reply(instance.messageHandler.get(message.guild, "NO_POINTS"));
      return;
    }

    if (pointsToGamble.toLowerCase() === "all") {
      if (coinFlip() === 0) {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          -actualPoints
        );
        message.channel.send(
          instance.messageHandler.get(message.guild, "ALL_IN_LOSE", {
            USER: `<@${userID}>`,
          })
        );
        return;
      } else {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          actualPoints
        );
        message.channel.send(
          instance.messageHandler.get(message.guild, "ALL_IN_WIN", {
            USER: `<@${userID}>`,
            POINTS: `${numeral(newPoints).format(",")}`,
          })
        );
        return;
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
        `you don't have enough points! You only have ${numeral(
          actualPoints
        ).format(",")} ${actualPoints !== 1 ? "points" : "point"}!`
      );
    } else {
      if (coinFlip() === 0) {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          -parseInt(pointsToGamble)
        );
        if (actualPoints === parseInt(pointsToGamble)) {
          message.channel.send(
            instance.messageHandler.get(message.guild, "ALL_IN_LOSE", {
              USER: `<@${userID}>`,
            })
          );
          return;
        } else {
          message.channel.send(
            `<@${userID}> gambled ${numeral(pointsToGamble).format(
              ","
            )} and lost ${numeral(pointsToGamble).format(",")} ${
              parseInt(pointsToGamble) !== 1 ? "points" : "point"
            }. They now have ${numeral(newPoints).format(",")} ${
              newPoints !== 1 ? "points" : "point"
            }.`
          );
          return;
        }
      } else {
        const newPoints = await gambling.addPoints(
          guildID,
          userID,
          parseInt(pointsToGamble)
        );
        if (actualPoints === parseInt(pointsToGamble)) {
          message.channel.send(
            instance.messageHandler.get(message.guild, "ALL_IN_WIN", {
              USER: `<@${userID}>`,
              POINTS: `${numeral(newPoints).format(",")}`,
            })
          );
          return;
        } else {
          message.channel.send(
            `<@${userID}> gambled ${numeral(pointsToGamble).format(
              ","
            )} and won ${numeral(pointsToGamble).format(",")} ${
              parseInt(pointsToGamble) !== 1 ? "points" : "point"
            }! They now have ${numeral(newPoints).format(",")} ${
              newPoints !== 1 ? "points" : "point"
            }.`
          );
          return;
        }
      }
    }
  },
};

const coinFlip = () => {
  return Math.floor(Math.random() * 2);
};
