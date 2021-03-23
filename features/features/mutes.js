const muteSchema = require("@schemas/mute-schema");

module.exports = (client) => {
  const checkMutes = async () => {
    const now = new Date();
    const conditional = {
      expires: { $lt: now },
      current: true,
    };

    const results = await muteSchema.find(conditional);
    if (results && results.length) {
      for (const result of results) {
        const { guildID, userID } = result;

        const guild = client.guilds.cache.get(guildID);
        const member = (await guild.members.fetch()).get(userID);

        const mutedRole = guild.roles.cache.find((r) => r.name === "Muted");
        member.roles.remove(mutedRole);
      }

      await muteSchema.updateMany(conditional, {
        current: false,
      });
    }

    setTimeout(checkMutes, 1000 * 5);
  };
  checkMutes();
};
