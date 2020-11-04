const welcomeSchema = require("@schemas/welcome-schema");
const { welcomeMessageCache } = require("@root/config.json");
module.exports = {
  commands: ["setwelcome", "welcome"],
  expectedArgs: "<The welcome message>",
  minArgs: 1,
  maxArgs: -1,
  description: "Sets a welcome message for the server.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async (msg, args, text, client) => {
    const { channel, guild } = msg;
    const welcomeMessage = args.join(" ");

    welcomeMessageCache[guild.id] = [channel.id, text];

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
  },
};
