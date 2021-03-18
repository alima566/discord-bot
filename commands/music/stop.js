const { MessageEmbed } = require("discord.js");

module.exports = {
  category: "🎵 Music",
  description: "Stops the song.",
  callback: async ({ message }) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      const msgEmbed = new MessageEmbed()
        .setAuthor("Not Connected", `${message.guild.iconURL()}`)
        .setColor("#1ED761")
        .setDescription(
          `❌ | You need to be in a voice channel in order to stop the music!`
        );
      return message.channel.send(msgEmbed);
    }

    const msgEmbed = new MessageEmbed()
      .setAuthor("Music Stopped", `${message.guild.iconURL()}`)
      .setColor("#1ED761")
      .setDescription(`⏹️ | Music stopped.`);

    message.channel.send(msgEmbed);
    message.client.player.stop(message);
  },
};
