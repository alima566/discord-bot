module.exports = {
  commands: "simjoin",
  description: "Simulates a member joining the server.",
  permissionError: "You must be an admininstrator to execute this command.",
  requiredPermissions: ["ADMINISTRATOR"],
  callback: (msg, args, text, client) => {
    client.emit("guildMemberAdd", msg.member);
  },
};
