const { MessageEmbed } = require("discord.js");
const { guildIcon } = require("@utils/functions");

module.exports = {
  category: "🎵 Music",
  expectedArgs: "<Track Number>",
  minArgs: 1,
  maxArgs: 1,
  description: "Removes the specified track from the queue.",
  callback: ({ message, args }) => {
    const voiceChannel = message.member.voice.channel;
    const msgEmbed = new MessageEmbed().setColor("#1ED761");

    if (!voiceChannel) {
      msgEmbed
        .setAuthor("Not Connected", guildIcon(message.guild))
        .setDescription(
          "❌ | You need to be in a voice channel in order to remove a track!"
        );
      return message.channel.send(msgEmbed);
    }

    const queue = message.client.player.getQueue(message);
    const tracks = queue.tracks;
    if (isNaN(args[0])) {
      msgEmbed
        .setAuthor("Error", guildIcon(message.guild))
        .setDescription("❌ | Please specify a valid track number!");
      return message.channel.send(msgEmbed);
    }

    const trackNumber = +args[0]; //Convert from string to number
    if (!Number.isInteger(trackNumber)) {
      msgEmbed
        .setAuthor("Error", guildIcon(message.guild))
        .setDescription("❌ | Please enter a whole number!");
      return message.channel.send(msgEmbed);
    }

    if (trackNumber === 0 && tracks.length === 1) {
      msgEmbed
        .setAuthor("Error", guildIcon(message.guild))
        .setDescription("❌ | There's nothing to remove from the queue!");
      return message.channel.send(msgEmbed);
    }

    if (trackNumber === 1) {
      msgEmbed
        .setAuthor("Error", guildIcon(message.guild))
        .setDescription(
          "❌ | You can't remove the currently playing song from the queue!"
        );
      return message.channel.send(msgEmbed);
    }

    if (trackNumber < 2 || trackNumber > tracks.length) {
      msgEmbed
        .setAuthor("Error", guildIcon(message.guild))
        .setDescription(
          `❌ | Please type a number between 2 and ${tracks.length}.`
        );
      return message.channel.send(msgEmbed);
    }

    const removedTrack = message.client.player.remove(
      message,
      tracks[trackNumber - 1]
    );
    msgEmbed
      .setAuthor("Track Removed", guildIcon(message.guild))
      .setDescription(
        `${
          removedTrack.title
        } has been removed from the queue.\n\nThere's now \`${
          tracks.length - 1
        }\` song${tracks.length !== 1 ? "s" : ""} in the queue.`
      );

    return message.channel.send(msgEmbed);
  },
};
