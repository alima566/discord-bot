const { GiveawaysManager } = require("discord-giveaways");
const { rafflePoints, giveawayReactEmoji } = require("@root/config.json");
const { addPoints } = require("@utils/gambling");
const { incrementRaffleWins } = require("@utils/raffleWins");
const { log } = require("@utils/functions");
const { sendMessageToBotLog } = require("@utils/functions");

module.exports = (client) => {
  client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
      botsCanWin: false,
      exemptPermissions: ["ADMINISTRATOR"],
      embedColor: "#FF0000",
      reaction: `${giveawayReactEmoji}`,
    },
  });

  client.giveawaysManager.on(
    "giveawayReactionAdded",
    (giveaway, member, reaction) => {
      log(
        "SUCCESS",
        "./features/cronJobs/startRaffle.js",
        `${member.user.tag} entered to giveaway #${giveaway.messageID} (${reaction.emoji.name})`
      );
      // sendMessageToBotLog(
      //   client,
      //   member.guild,
      //   `${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`
      // );
    }
  );

  client.giveawaysManager.on(
    "giveawayReactionRemoved",
    (giveaway, member, reaction) => {
      log(
        "SUCCESS",
        "./features/cronJobs/startRaffle.js",
        `${member.user.tag} unreacted to giveaway #${giveaway.messageID} (${reaction.emoji.name})`
      );
      // sendMessageToBotLog(
      //   client,
      //   member.guild,
      //   `${member.user.tag} unreacted to giveaway #${giveaway.messageID} (${reaction.emoji.name})`
      // );
    }
  );

  client.giveawaysManager.on("giveawayEnded", async (giveaway, winners) => {
    winners.forEach(async (w) => {
      if (
        giveaway.messages.giveaway ==
        `${giveawayReactEmoji}${giveawayReactEmoji} **RAFFLE** ${giveawayReactEmoji}${giveawayReactEmoji}`
      ) {
        const newPoints = await addPoints(
          w.guild.id,
          w.user.id,
          parseInt(rafflePoints)
        );

        await incrementRaffleWins(w.guild.id, w.user.id);

        // sendMessageToBotLog(
        //   client,
        //   w.guild,
        //   `${rafflePoints} points have been given to ${w.user.tag} and they now have ${newPoints}.`
        // );
        log(
          "SUCCESS",
          "./features/cronJobs/startRaffle.js",
          `${rafflePoints} points have been given to ${w.user.tag} and they now have ${newPoints}.`
        );
      }
    });
  });
};

module.exports.config = {
  displayName: "Giveaways Manager",
  dbName: "GIVEAWAYS_MANAGER",
  loadDBFirst: false,
};
