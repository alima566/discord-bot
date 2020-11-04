const ms = require("ms");
module.exports = {
  commands: ["end-giveaway", "egive"],
  expectedArgs: "<message_ID>",
  minArgs: 1,
  maxArgs: 1,
  description: "Ends a giveaway.",
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

    // Edit the giveaway
    client.giveawaysManager
      .edit(giveaway.messageID, {
        setEndTimestamp: Date.now(),
      })
      // Success message
      .then(() => {
        // Success message
        msg.channel.send(
          "Giveaway will end in less than " +
            client.giveawaysManager.options.updateCountdownEvery / 1000 +
            " seconds..."
        );
      })
      .catch((e) => {
        if (
          e.startsWith(
            `Giveaway with message ID ${giveaway.messageID} is already ended.`
          )
        ) {
          msg.channel.send("This giveaway is already ended!");
        } else {
          console.error(e);
          msg.channel.send("An error occured...");
        }
      });
  },
};
