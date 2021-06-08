const fetch = require("node-fetch");
const { getBotChatChannel } = require("@utils/dbHelpers/botChat");

module.exports = (client, instance) => {
  client.on("message", async (message) => {
    const { guild, channel } = message;
    if (
      message.author.bot ||
      message.content.startsWith(instance.getPrefix(guild)) // Don't have bot chat back if running a command
    )
      return;

    const botChatChannel = await getBotChatChannel(guild.id).catch((e) =>
      console.log(e)
    );

    if (botChatChannel === channel.id) {
      channel.startTyping();
      const resp = await fetch(
        `https://api.deltaa.me/chatbot?message=${encodeURIComponent(
          message.content
        )}&name=${encodeURIComponent(client.user.username)}&user=${
          message.author.id
        }&gender=Female`
      );

      const data = await resp.json();
      channel.send(data.message);
      channel.stopTyping();
    }
  });
};
