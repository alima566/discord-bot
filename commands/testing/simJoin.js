module.exports = {
  commands: "simjoin",
  category: "Testing",
  description: "Simulates a member joining the server.",
  permissionError: "You must be an administrator to execute this command.",
  requiredPermissions: ["ADMINISTRATOR"],
  callback: (msg, args, text, client) => {
    client.emit("guildMemberAdd", msg.member);
  },
};
