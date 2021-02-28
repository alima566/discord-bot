module.exports = {
  commands: ["edit"],
  category: "Admin",
  expectedArgs: "<Tagged channel> <Message ID> <Message>",
  minArgs: 3,
  maxArgs: -1,
  description: "Edits an existing bot message.",
  ownerOnly: true,
  permissionError: "You must be the bot owner to execute this command.",
  callback: async ({ message, args }) => {
    const channel = message.mentions.channels.first();
    if (!channel) {
      return message.reply(
        `Please specify which channel the message is located in.`
      );
    }

    args.shift(); // Remove the channel arg
    const messageID = args[0];
    if (!messageID) {
      return message.reply(`Please specify a message ID.`);
    }

    try {
      const messageToEdit = await channel.messages.fetch(
        messageID,
        false,
        true
      );
      if (messageToEdit) {
        args.shift(); // Remove the message ID arg
        const editedMsg = args.join(" ");
        messageToEdit.edit(editedMsg);
        message.delete();
      }
    } catch (e) {
      message.delete();
      return message.reply(`That message no longer exists.`).then((msg) => {
        msg.delete({ timeout: 3000 });
      });
    }
  },
};
