const { getFC } = require("@dbHelpers/fc");

module.exports = {
  category: "💡 Misc",
  cooldown: "15s",
  minArgs: 0,
  maxArgs: 0,
  description: "Shows the server owner's Nintendo Switch friend code.",
  callback: async ({ message }) => {
    const { guild, channel } = message;
    const result = await getFC(guild.id);

    if (!result) {
      return message.reply("The server owner has not yet set a friend code.");
    }
    const owner = guild.owner.user.tag;
    const { friendCode } = result;
    return channel.send(
      `${owner}'s Nintendo Switch Friend code is \`${friendCode}\`.`
    );
  },
};
