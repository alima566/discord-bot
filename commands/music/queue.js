const { MessageEmbed } = require("discord.js");
const {
  chunkArray,
  paginateEmbed,
  guildIcon,
  msToTime,
} = require("@utils/functions");

module.exports = {
  commands: ["songs"],
  category: "🎵 Music",
  description: "Gets all the songs currently in the queue.",
  callback: async ({ message }) => {
    const queue = message.client.player.getQueue(message);
    if (!queue) {
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor("No Music", guildIcon(message.guild))
        .setDescription(`❌ | There are currently no songs in the queue!`);

      return message.channel.send(msgEmbed);
    }

    const tracks = queue.tracks;
    let tracksArray = chunkArray(tracks, 10);
    const progressBar = message.client.player.createProgressBar(message, {
      timecodes: true,
    });

    if (tracksArray.length == 1) {
      const embed = new MessageEmbed()
        .setAuthor("Music Queue", guildIcon(message.guild))
        .setColor("#1ED761");

      let text = "";
      for (let i = 0; i < tracks.length; i++) {
        text += `${i + 1}. [${tracks[i].title}](${tracks[i].url}) (${msToTime(
          tracks[i].durationMS
        )}) - Requested by ${tracks[i].requestedBy.tag}\n`;
        if (i === 0) {
          text += `${progressBar}\n`;
        }
      }

      embed
        .setDescription(text)
        .setFooter(
          `Total Songs: ${tracks.length} | Total Duration: ${msToTime(
            queue.totalTime
          )}`
        );
      return message.channel.send(embed);
    }

    const embedArray = [];
    for (let i = 0; i < tracksArray.length; i++) {
      let text = "";
      const embed = new MessageEmbed()
        .setAuthor("Music Queue", guildIcon(message.guild))
        .setColor("#1ED761");

      let counter = (i + 1) * 10 - 10;
      for (let j = 0; j < tracksArray[i].length; j++) {
        text += `${counter + 1}. [${tracksArray[i][j].title}](${
          tracksArray[i][j].url
        }) (${msToTime(tracksArray[i][j].durationMS)}) - Requested by ${
          tracksArray[i][j].requestedBy.tag
        }\n`;
        if (counter === 0) {
          text += `${progressBar}\n`;
        }
        counter++;
      }
      embed
        .setDescription(text)
        .setFooter(
          `Total Songs: ${tracks.length} | Total Duration: ${msToTime(
            queue.totalTime
          )} | Page ${i + 1} of ${tracksArray.length}`
        );
      embedArray.push(embed);
    }
    paginateEmbed(message, embedArray, { time: 1000 * 60 });
  },
};
