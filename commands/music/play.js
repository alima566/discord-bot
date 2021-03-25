const { MessageEmbed } = require("discord.js");
const { guildIcon } = require("@utils/functions");
const { log } = require("@utils/functions");

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

    message.client.player.play(message, args.join(" ")).catch((e) => {
      log(
        "ERROR",
        "./commands/music/play.js",
        `An error has occurred: ${e.message}`
      );
      const msgEmbed = new MessageEmbed()
        .setAuthor("Error", guildIcon(message.guild))
        .setColor("#1ED761")
        .setDescription(
          `❌ | An error occurred while trying to play the specified track. Please try again.`
        );
      return message.channel.send(msgEmbed);
    });
  },
};
