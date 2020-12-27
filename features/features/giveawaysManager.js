const { GiveawaysManager } = require("discord-giveaways");
const { rafflePoints, giveawayReactEmoji } = require("@root/config.json");
const gambling = require("@utils/gambling");
const { log } = require("@utils/functions");

module.exports = (client) => {
  client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
      botsCanWin: false,
      exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
      embedColor: "#FF0000",
      reaction: `${giveawayReactEmoji}`,
    },
  });

  client.giveawaysManager.on(
    "giveawayReactionAdded",
    (giveaway, member, reaction) => {
      let channel = client.channels.cache.get("740349602800205844");
      channel.send(
        `${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`
      );
      console.log(
        `${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`
      );
    }
  );

  client.giveawaysManager.on(
    "giveawayReactionRemoved",
    (giveaway, member, reaction) => {
      let channel = client.channels.cache.get("740349602800205844");
      channel.send(
        `${member.user.tag} unreacted to giveaway #${giveaway.messageID} (${reaction.emoji.name})`
      );
      console.log(
        `${member.user.tag} unreacted to giveaway #${giveaway.messageID} (${reaction.emoji.name})`
      );
    }
  );

  client.giveawaysManager.on("giveawayEnded", async (giveaway, winners) => {
    const botChannel = client.channels.cache.get("740349602800205844");
    if (
      giveaway.messages.giveaway ==
      `${giveawayReactEmoji}${giveawayReactEmoji} **RAFFLE** ${giveawayReactEmoji}${giveawayReactEmoji}`
    ) {
      console.log("HERE");
      winners.forEach(async (w) => {
        const newPoints = await gambling.addPoints(
          w.guild.id,
          w.user.id,
          parseInt(rafflePoints)
        );
        botChannel.send(
          `${rafflePoints} points have been given to ${w.user.tag} and they now have ${newPoints}.`
        );
        log(
          "SUCCESS",
          "./features/cronJobs/startRaffle.js",
          `${rafflePoints} points have been given to ${w.user.tag} and they now have ${newPoints}.`
        );
      });
    }
  });
};

module.exports.config = {
  displayName: "Giveaways Manager",
  dbName: "GIVEAWAYS_MANAGER",
  loadDBFirst: false,
};
