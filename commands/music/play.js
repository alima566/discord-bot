const { MessageEmbed } = require("discord.js");
const { guildIcon } = require("@utils/functions");

module.exports = {
  category: "🎵 Music",
  expectedArgs: "<Search query>",
  minArgs: 1,
  maxArgs: -1,
  description: "Plays the specified song.",
  callback: ({ message, args }) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      const msgEmbed = new MessageEmbed()
        .setAuthor("Not Connected", guildIcon(message.guild))
        .setColor("#1ED761")
        .setDescription(
          `❌ | You need to be in a voice channel in order to play music!`
        );
      return message.channel.send(msgEmbed);
    }

    return message.client.player.play(message, args.join(" "));
  },
};
