const { MessageEmbed } = require("discord.js");
const { guildIcon } = require("@utils/functions");

module.exports = {
  category: "🎵 Music",
  description: "Skips the current song.",
  callback: ({ message }) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      const msgEmbed = new MessageEmbed()
        .setAuthor("Not Connected", guildIcon(message.guild))
        .setColor("#1ED761")
        .setDescription(
          `❌ | You need to be in a voice channel in order to skip the music!`
        );
      return message.channel.send(msgEmbed);
    }

    const msgEmbed = new MessageEmbed()
      .setAuthor(`Track Skipped`, guildIcon(message.guild))
      .setColor("#1ED761")
      .setDescription(`⏭️ | Track skipped.`);
    message.channel.send(msgEmbed);
    message.client.player.skip(message);
  },
};
