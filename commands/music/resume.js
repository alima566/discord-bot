const { MessageEmbed } = require("discord.js");
const { guildIcon } = require("@utils/functions");

module.exports = {
  category: "🎵 Music",
  description: "Resumes the paused music.",
  callback: async ({ message }) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      const msgEmbed = new MessageEmbed()
        .setAuthor("Not Connected", guildIcon(message.guild))
        .setColor("#1ED761")
        .setDescription(
          `❌ | You need to be in a voice channel in order to resume the music!`
        );
      return message.channel.send(msgEmbed);
    }

    const msgEmbed = new MessageEmbed()
      .setColor("#1ED761")
      .setAuthor("Track Resumed", guildIcon(message.guild))
      .setDescription("▶️ | Music has resumed playing.");

    message.channel.send(msgEmbed);
    message.client.player.resume(message);
  },
};
