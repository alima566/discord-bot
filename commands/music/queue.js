const { MessageEmbed } = require("discord.js");

module.exports = {
  commands: ["queue", "songs"],
  category: "Music",
  description: "Gets all the songs currently in the queue.",
  callback: async ({ message }) => {
    const queue = message.client.player.getQueue(message);
    if (!queue) {
      return message.channel.send(`There are currently no songs in the queue!`);
    }

    const tracks = queue.tracks;
    const embed = new MessageEmbed()
      .setAuthor(`Music Queue`, `${message.guild.iconURL()}`)
      .setColor("#1ED761");
    const progressBar = message.client.player.createProgressBar(message, {
      timecodes: true,
    });

    let text = "";
    for (let i = 0; i < tracks.length; i++) {
      text += `${i + 1}. [${tracks[i].title}](${tracks[i].url}) (${
        tracks[i].duration
      }) - Requested by ${tracks[i].requestedBy.tag}\n`;
      if (i === 0) {
        text += `${progressBar}\n`;
      }
    }

    embed.setDescription(text).setFooter(`Total Songs: ${tracks.length}`);
    message.channel.send(embed);
  },
};
