const discordNitroSchema = require("@schemas/discord-nitro-schema");

module.exports = {
  commands: ["setnitro", "nitro"],
  category: "Admin",
  expectedArgs: "<The Discord Nitro Link>",
  minArgs: 1,
  maxArgs: 1,
  description: "Sets the Discord Nitro Link for the monthly winner.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async ({ message, args }) => {
    const { guild } = message;
    const nitroLink = args[0];

    await discordNitroSchema.findOneAndUpdate(
      {
        _id: guild.id,
      },
      {
        _id: guild.id,
        nitroLink,
      },
      {
        upsert: true,
      }
    );

    message.reply(`Discord Nitro link successfully updated.`).then((m) => {
      message.client.setTimeout(() => m.delete(), 1000 * 3);
    });
    message.delete();
  },
};
