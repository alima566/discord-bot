const { GiveawaysManager } = require("discord-giveaways");
module.exports = (client) => {
  client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
      botsCanWin: false,
      exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
      embedColor: "#FF0000",
      reaction: "🎉",
    },
  });

  client.giveawaysManager.on(
    "giveawayReactionAdded",
    (giveaway, member, reaction) => {
      let channel = client.channels.cache.find(
        (c) => c.id === "740349602800205844"
      );
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
      let channel = client.channels.cache.find(
        (c) => c.id === "740349602800205844"
      );
      channel.send(
        `${member.user.tag} unreacted to giveaway #${giveaway.messageID} (${reaction.emoji.name})`
      );
      console.log(
        `${member.user.tag} unreacted to giveaway #${giveaway.messageID} (${reaction.emoji.name})`
      );
    }
  );
};
