module.exports = {
  category: "Bot Owner",
  expectedArgs: "[The tagged channel] <The message you want to say>",
  minArgs: 0,
  maxArgs: -1,
  description: "Makes the bot say whatever you type.",
  ownerOnly: true,
  permissionError: "You must be the bot owner to execute this command.",
  callback: async ({ message, args }) => {
    let msg = "";
    const channel = message.mentions.channels.first();
    if (channel) {
      if (args.length === 1 && message.attachments.size === 0) {
        return message.channel.send(`Please provide something to say.`);
      }

      msg = args.slice(1).join(" ");
      sendMessage(message, msg, { channel });
    } else {
      msg = args.join(" ");
      sendMessage(message, msg);
    }
    message.delete();
  },
};

const sendMessage = (message, content, options) => {
  let channel = message.channel;
  if (options) {
    if (options.channel) {
      channel = options.channel;
    }
  }

  if (message.attachments.size > 0) {
    const attachment = message.attachments.first();
    channel.send(content, attachment); //Only send the attachment and not any text
  } else {
    channel.send(content);
  }
};
