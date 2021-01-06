const { MessageEmbed } = require("discord.js");

module.exports = {
  commands: ["nowplaying", "np", "song"],
  category: "Music",
  description: "Shows what's currently playing.",
  callback: async ({ message }) => {
    const nowPlaying = message.client.player.nowPlaying(message);
    if (!nowPlaying) return;

    const progressBar = message.client.player.createProgressBar(message, {
      timecodes: true,
    });
    const msgEmbed = new MessageEmbed()
      .setColor("#1ED761")
      .setAuthor(`Currently Playing`, `${message.guild.iconURL()}`)
      .setDescription(
        `[${nowPlaying.title}](${nowPlaying.url}) (${nowPlaying.duration})\n${progressBar}`
      )
      .setThumbnail(`${nowPlaying.thumbnail}`)
      .setFooter(`Requested by ${nowPlaying.requestedBy.tag}`);
    return message.channel.send(msgEmbed);
  },
};
