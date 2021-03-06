const { setUID } = require("@dbHelpers/uid");

module.exports = {
  category: "Guild Owner",
  minArgs: 1,
  maxArgs: 1,
  description: "Sets the UID for the guild owner only.",
  expectedArgs: "<UID>",
  callback: async ({ message, text, client }) => {
    const { author, guild } = message;
    if (author.id !== guild.ownerID) {
      return message
        .reply("Only the server owner can use this command.")
        .then((msg) => {
          client.setTimeout(() => msg.delete(), 1000 * 5);
        });
    }

    // const regex = text.match(/^DA-\d{4}-\d{4}-\d{4}$/g);
    // if (!regex) {
    //   return message.reply(
    //     `Dream Address is of invalid format. Format must be in \`DA-1234-1234-1234\`.`
    //   );
    // }
    try {
      await setUID(guild.id, text);

      return message.reply(`Your UID has been successfully set.`);
    } catch (e) {
      console.log(e);
      return message.reply(
        `An error occurred while trying to set your UID. Please try again.`
      );
    }
  },
};
