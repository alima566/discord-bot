const { MessageEmbed } = require("discord.js");

module.exports = {
  commands: ["queue", "songs"],
  category: "Music",
  description: "Gets all the songs currently in the queue.",
  callback: async (msg) => {
    const queue = msg.client.player.getQueue(msg);
    if (!queue) {
      return msg.channel.send(`There are currently no songs in the queue!`);
    }

    const tracks = queue.tracks;
    const embed = new MessageEmbed()
      .setAuthor(
        `There ${tracks.length != 1 ? "are" : "is"} currently ${
          tracks.length
        } song${tracks.length != 1 ? "s" : ""} in the queue.`
      )
      .setColor("#1ED761");

    let text = "";
    for (let i = 0; i < tracks.length; i++) {
      text += `${i + 1}. ${tracks[i].title} (${
        tracks[i].duration
      }) - Requested by: ${tracks[i].requestedBy}\n`;
    }

    embed.setDescription(text);
    msg.channel.send(embed);
  },
};
