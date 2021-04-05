module.exports = {
  category: "Testing",
  description: "Simulates a banning member from the server.",
  permissionError: "You must be an administrator to execute this command.",
  requiredPermissions: ["ADMINISTRATOR"],
  callback: ({ message, client }) => {
    client.emit("guildBanAdd", message.guild, message.author);
  },
};
