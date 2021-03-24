const { MessageEmbed } = require("discord.js");
const { guildIcon } = require("@utils/functions");

module.exports = {
  category: "🎵 Music",
  description: "Pauses the music.",
  callback: async ({ message }) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      const msgEmbed = new MessageEmbed()
        .setAuthor("Not Connected", guildIcon(message.guild))
        .setColor("#1ED761")
        .setDescription(
          `❌ | You need to be in a voice channel in order to pause the music!`
        );
      return message.channel.send(msgEmbed);
    }

    const msgEmbed = new MessageEmbed()
      .setAuthor(`Music Paused`, guildIcon(message.guild))
      .setColor("#1ED761")
      .setDescription(`⏸️ | Music paused.`);

    message.channel.send(msgEmbed);
    message.client.player.pause(message);
  },
};
