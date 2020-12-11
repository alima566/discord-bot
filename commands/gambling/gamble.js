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
  callback: async (msg, args, text, client, prefix, instance) => {
    const target = msg.author;
    const channelID = msg.channel.id;
    const guildID = msg.guild.id;
    const userID = target.id;
    const gamblingChannel = await gambling.getGamblingChannel(guildID);

    if (gamblingChannel !== null) {
      if (channelID !== gamblingChannel) {
        msg
          .reply(`Gambling is only allowed in <#${gamblingChannel}>!`)
          .then((message) => {
            message.delete({ timeout: 5000 });
          });
        msg.delete();
        return;
      }
    } else {
      msg.reply(
        `A gambling channel needs to be set first in order for this command to be used.`
      );
      return;
    }

    const pointsToGamble = args[0];
    const actualPoints = await gambling.getPoints(guildID, userID);

    if (actualPoints === 0) {
      msg.channel.send(instance.messageHandler.get(msg.guild, "NO_POINTS"));
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
          instance.messageHandler.get(msg.guild, "ALL_IN_LOSE", {
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
        msg.channel.send(
          instance.messageHandler.get(msg.guild, "ALL_IN_WIN", {
            USER: `<@${userID}>`,
            POINTS: `${numeral(newPoints).format(",")}`,
          })
        );
        return;
      }
    } else if (isNaN(pointsToGamble)) {
      msg.channel.send(instance.messageHandler.get(msg.guild, "VALID_POINTS"));
      return;
    } else if (pointsToGamble < 1) {
      msg.channel.send(instance.messageHandler.get(msg.guild, "ONE_POINT"));
      return;
    } else if (pointsToGamble > actualPoints) {
      return msg.reply(
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
          msg.channel.send(
            instance.messageHandler.get(msg.guild, "ALL_IN_LOSE", {
              USER: `<@${userID}>`,
            })
          );
          return;
        } else {
          msg.channel.send(
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
          msg.channel.send(
            instance.messageHandler.get(msg.guild, "ALL_IN_WIN", {
              USER: `<@${userID}>`,
              POINTS: `${numeral(newPoints).format(",")}`,
            })
          );
          return;
        } else {
          msg.channel.send(
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
