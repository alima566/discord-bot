const { MessageEmbed } = require("discord.js");
const { guildIcon, msToTime } = require("@utils/functions");

module.exports = {
  commands: ["np", "song"],
  category: "🎵 Music",
  description: "Shows what's currently playing.",
  callback: async ({ message }) => {
    const nowPlaying = message.client.player.nowPlaying(message);
    if (!nowPlaying) return;

    const progressBar = message.client.player.createProgressBar(message, {
      timecodes: true,
    });

    const nextTrack = nowPlaying.queue.tracks;
    const msgEmbed = new MessageEmbed()
      .setColor("#1ED761")
      .setAuthor("Currently Playing", guildIcon(message.guild))
      .setDescription(
        `[${nowPlaying.title}](${nowPlaying.url}) (${msToTime(
          nowPlaying.durationMS
        )})\n${progressBar}\n\n**Up Next: **${
          nextTrack[1] ? nextTrack[1].title : "Nothing"
        }`
      )
      .setThumbnail(nowPlaying.thumbnail)
      .setFooter(
        `Requested by ${nowPlaying.requestedBy.tag}`,
        nowPlaying.requestedBy.displayAvatarURL({ dynamic: true })
      );
    return message.channel.send(msgEmbed);
  },
};
