const { MessageEmbed } = require("discord.js");
const { guildIcon } = require("@utils/functions");

module.exports = {
  category: "🎵 Music",
  description: "Stops the song.",
  callback: async ({ message }) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      const msgEmbed = new MessageEmbed()
        .setAuthor("Not Connected", guildIcon(message.guild))
        .setColor("#1ED761")
        .setDescription(
          `❌ | You need to be in a voice channel in order to stop the music!`
        );
      return message.channel.send(msgEmbed);
    }

    const msgEmbed = new MessageEmbed()
      .setAuthor("Music Stopped", guildIcon(message.guild))
      .setColor("#1ED761")
      .setDescription(`⏹️ | Music stopped.`);

    message.channel.send(msgEmbed);
    message.client.player.stop(message);
  },
};
