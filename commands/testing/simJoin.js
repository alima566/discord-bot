module.exports = {
  commands: "simjoin",
  category: "Testing",
  description: "Simulates a member joining the server.",
  permissionError: "You must be an administrator to execute this command.",
  requiredPermissions: ["ADMINISTRATOR"],
  callback: ({ message, client }) => {
    client.emit("guildMemberAdd", message.member);
  },
};
