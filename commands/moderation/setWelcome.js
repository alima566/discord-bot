const welcomeSchema = require("@schemas/welcome-schema");
const { welcomeMessageCache } = require("@root/config.json");
module.exports = {
  commands: ["setwelcome", "welcome"],
  category: "Moderation",
  expectedArgs: "<The welcome message>",
  minArgs: 1,
  maxArgs: -1,
  description: "Sets a welcome message for the server.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async ({ message, args }) => {
    const { guild } = message;
    let welcomeMessage = ""; //args.join(" ");

    let channel = message.mentions.channels.first();
    if (channel) {
      if (args.length === 1) {
        return message.channel.send(`Please provide a welcome message.`);
      }
      welcomeMessage = args.slice(1).join(" ");
    } else {
      channel = message.channel;
      welcomeMessage = args.join(" ");
    }

    welcomeMessageCache[guild.id] = [channel.id, welcomeMessage];

    await welcomeSchema.findOneAndUpdate(
      {
        _id: guild.id,
      },
      {
        _id: guild.id,
        channelID: channel.id,
        welcomeMessage,
      },
      {
        upsert: true,
      }
    );

    message
      .reply(
        `Welcome has been set to <#${channel.id}> and the welcome message is ${welcomeMessage}`
      )
      .then((m) => {
        m.delete({ timeout: 3000 });
      });
    message.delete();
  },
};
