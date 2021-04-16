const { setFC } = require("@dbHelpers/fc");

module.exports = {
  category: "Guild Owner",
  description: "Sets the friend code for the guild owner only.",
  expectedArgs: "<Friend Code>",
  callback: async ({ message, text, client }) => {
    const { author, guild } = message;
    if (author.id !== guild.ownerID) {
      return message
        .reply("Only the server owner can use this command.")
        .then((msg) => {
          client.setTimeout(() => msg.delete(), 1000 * 5);
        });
    }

    const regex = text.match(/^SW-\d{4}-\d{4}-\d{4}$/g);
    if (!regex) {
      return message.reply(
        `Friend code is of invalid format. Format must be in \`SW-1234-1234-1234\`.`
      );
    }
    try {
      await setFC(guild.id, text);

      return message.reply(`Your friend code has been successfully set.`);
    } catch (e) {
      console.log(e);
      return message.reply(
        `An error occurred while trying to set your friend code. Please try again.`
      );
    }
  },
};
