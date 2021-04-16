const { getUID } = require("@dbHelpers/uid");

module.exports = {
  category: "💡⚔️ Genshin",
  cooldown: "15s",
  description: "Show's the server owner's UID.",
  callback: async ({ message }) => {
    const { guild, channel } = message;
    const result = await getUID(guild.id);

    if (!result) {
      return message
        .reply("The server owner hasn't set a UID yet.")
        .then((msg) => {
          message.client.setTimeout(() => msg.delete(), 1000 * 5);
        });
    }
    const owner = guild.owner.user.tag;
    const { uid } = result;
    return channel.send(`${owner}'s UID is \`${uid}\`.`);
  },
};
