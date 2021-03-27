module.exports = {
  category: "Bot Owner",
  expectedArgs: "<Tagged channel> <JSON>",
  minArgs: 2,
  description: "Sends a message as an embed",
  ownerOnly: true,
  permissionError: "You must be the bot owner to execute this command.",
  callback: ({ message, args }) => {
    const targetChannel = message.mentions.channels.first();
    if (!targetChannel) {
      return message.reply(
        `Please specify which channel to send the embed to.`
      );
    }

    args.shift(); // Remove the channel mention

    try {
      // Get the JSON data
      const json = JSON.parse(args.join(" "));
      const { text = "" } = json;
      message.delete();
      return targetChannel.send(text, { embed: json });
    } catch (e) {
      message.delete();
      return message.channel.send(`Invalid JSON: ${e.message}`);
    }
  },
};
