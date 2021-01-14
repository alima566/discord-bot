module.exports = {
  commands: ["poll"],
  category: "Admin",
  expectedArgs: "",
  maxArgs: -1,
  description: "Creates a poll.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async ({ message, args }) => {
    const reactions = args;
    await message.delete();
    const fetched = await message.channel.messages.fetch({ limit: 1 });
    if (fetched && fetched.first()) {
      addReactions(fetched.first(), reactions);
    }
  },
};

const addReactions = async (msg, reactions = []) => {
  if (reactions.length == 0) {
    msg.react("👍").then(() => {
      msg.react("👎");
    });
  } else if (reactions.length == 1) {
    return msg
      .reply(
        `There needs to be a minimum of 2 reactions in order to create a poll!`
      )
      .then((m) => {
        m.delete({ timeout: 3000 });
      });
  } else {
    for (const reaction of reactions) {
      await msg.react(reaction);
    }
  }
};
