module.exports = {
  category: "Testing",
  description: "Simulates a member leaving the server.",
  permissionError: "You must be an administrator to execute this command.",
  requiredPermissions: ["ADMINISTRATOR"],
  callback: ({ message, client }) => {
    client.emit("guildMemberRemove", message.member);
  },
};
