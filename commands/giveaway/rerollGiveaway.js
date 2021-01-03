module.exports = {
  commands: ["reroll-giveaway", "rgive"],
  category: "Giveaways",
  expectedArgs: "<message_ID>",
  minArgs: 1,
  maxArgs: 1,
  description: "Re-rolls a giveaway.",
  requiredPermissions: ["MANAGE_MESSAGES"],
  callback: ({ message, args, client }) => {
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
      return message.channel.send(
        "Unable to find a giveaway for `" + args.join(" ") + "`."
      );
    }

    // Reroll the giveaway
    client.giveawaysManager
      .reroll(giveaway.messageID)
      .then(() => {
        // Success message
        message.channel.send("Giveaway rerolled!");
      })
      .catch((e) => {
        if (
          e.startsWith(
            `Giveaway with message ID ${giveaway.messageID} is not ended.`
          )
        ) {
          message.channel.send("This giveaway has not ended!");
        } else {
          console.error(e);
          message.channel.send("An error occured...");
        }
      });
  },
};
