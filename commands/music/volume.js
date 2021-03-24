const { MessageEmbed } = require("discord.js");
const { guildIcon } = require("@utils/functions");

module.exports = {
  commands: ["setvolume"],
  category: "🎵 Music",
  description: "Adjust the volume of the song.",
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: "<The volume percentage>",
  callback: async ({ message, args }) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      const msgEmbed = new MessageEmbed()
        .setAuthor("Not Connected", guildIcon(message.guild))
        .setColor("#1ED761")
        .setDescription(
          `❌ | You need to be in a voice channel in order to adjust the volume!`
        );
      return message.channel.send(msgEmbed);
    }

    if (isNaN(args[0])) {
      return message.reply(`Please enter a valid number.`);
    }

    if (parseInt(args[0]) < 0 || parseInt(args[0]) > 100) {
      return message.reply(`Please enter a valid number between 0 and 100.`);
    }

    const msgEmbed = new MessageEmbed()
      .setAuthor("Volume", guildIcon(message.guild))
      .setColor("#1ED761")
      .setDescription(`🔊 | Volume level adjusted to ${args[0]}%.`);

    message.channel.send(msgEmbed);
    message.client.player.setVolume(message, parseInt(args[0]));
  },
};
