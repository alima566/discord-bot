module.exports = {
  commands: ["reroll-giveaway", "rgive"],
  expectedArgs: "<message_ID>",
  minArgs: 1,
  maxArgs: 1,
  description: "Re-rolls a giveaway.",
  requiredPermissions: ["MANAGE_MESSAGES"],
  callback: (msg, args, text, client) => {
    // try to found the giveaway with prize then with ID
    let giveaway =
      // Search with giveaway prize
      client.giveawaysManager.giveaways.find(
        (g) => g.prize === args.join(" ")
      ) ||
      // Search with giveaway ID
      client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // If no giveaway was found
    if (!giveaway) {
      return msg.channel.send(
        "Unable to find a giveaway for `" + args.join(" ") + "`."
      );
    }

    // Reroll the giveaway
    client.giveawaysManager
      .reroll(giveaway.messageID)
      .then(() => {
        // Success message
        msg.channel.send("Giveaway rerolled!");
      })
      .catch((e) => {
        if (
          e.startsWith(
            `Giveaway with message ID ${giveaway.messageID} is not ended.`
          )
        ) {
          msg.channel.send("This giveaway has not ended!");
        } else {
          console.error(e);
          msg.channel.send("An error occured...");
        }
      });
  },
};
