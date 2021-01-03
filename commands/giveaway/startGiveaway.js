const { giveawayReactEmoji } = require("@root/config.json");
const ms = require("ms");
module.exports = {
  commands: ["start-giveaway", "sgive"],
  category: "Giveaways",
  expectedArgs: "<channel> <duration> <# of winners> <prize>",
  minArgs: 4, //5,
  description: "Starts a giveaway.",
  requiredPermissions: ["MANAGE_MESSAGES"],
  callback: ({ message, args, client }) => {
    // Giveaway channel
    let giveawayChannel = message.mentions.channels.first();
    // If no channel is mentionned
    if (!giveawayChannel) {
      return message.channel.send(":x: You have to mention a valid channel!");
    }

    /*let giveawayRole = msg.mentions.roles.first();
    if (!giveawayRole) {
      return msg.channel.send(":x: You have to mention a valid role!");
    }*/

    // Giveaway duration
    let giveawayDuration = args[1]; //args[2];
    // If the duration isn't valid
    if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
      return message.channel.send(":x: You have to specify a valid duration!");
    }

    // Number of winners
    let giveawayNumberWinners = args[2]; //args[3];
    // If the specified number of winners is not a number
    if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
      return message.channel.send(
        ":x: You have to specify a valid number of winners!"
      );
    }

    // Giveaway prize
    let giveawayPrize = args.slice(3).join(" ");
    // If no prize is specified
    if (!giveawayPrize) {
      return message.channel.send(":x: You have to specify a valid prize!");
    }

    // Start the giveaway
    client.giveawaysManager.start(giveawayChannel, {
      // The giveaway duration
      time: ms(giveawayDuration),
      // The giveaway prize
      prize: giveawayPrize,
      // The giveaway winner count
      winnerCount: giveawayNumberWinners,
      // Who hosts this giveaway
      hostedBy: message.author,
      // Messages
      messages: {
        giveaway: `${giveawayReactEmoji}${giveawayReactEmoji} **GIVEAWAY** ${giveawayReactEmoji}${giveawayReactEmoji}`,
        giveawayEnded: `${giveawayReactEmoji}${giveawayReactEmoji} **GIVEAWAY ENDED** ${giveawayReactEmoji}${giveawayReactEmoji}`,
        timeRemaining: "Time remaining: **{duration}**!",
        inviteToParticipate: `React with ${giveawayReactEmoji} to participate!`,
        winMessage: "Congratulations, {winners}! You won **{prize}**!",
        embedFooter: "Giveaways",
        noWinner: "Giveaway cancelled, no valid participants.",
        hostedBy: "Hosted by: {user}",
        winners: "winner(s)",
        endedAt: "Ended at",
        units: {
          seconds: "seconds",
          minutes: "minutes",
          hours: "hours",
          days: "days",
          pluralS: false, // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
        },
      },
    });

    message.channel.send(`Giveaway started in ${giveawayChannel}!`);
    message.delete();
  },
};
