const { getDA } = require("@dbHelpers/dreamAddress");

module.exports = {
  commands: ["da"],
  category: "💡 Misc",
  cooldown: "15s",
  description: "Show's the server owner's ACNH dream address.",
  callback: async ({ message }) => {
    const { guild, channel } = message;
    const result = await getDA(guild.id);

    if (!result) {
      return message
        .reply("The server owner hasn't set a dream address yet.")
        .then((msg) => {
          message.client.setTimeout(() => msg.delete(), 1000 * 5);
        });
    }
    const owner = guild.owner.user.tag;
    const { dreamAddress } = result;
    return channel.send(
      `${owner}'s ACNH Dream Address is \`${dreamAddress}\`.`
    );
  },
};
