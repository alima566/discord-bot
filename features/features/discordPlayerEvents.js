const { MessageEmbed } = require("discord.js");
const ms = require("ms");
module.exports = (client) => {
  client.player
    .on("trackStart", (msg, track) => {
      msg.channel.send(
        `Now playing: **${track.title}** - Requested by ${track.requestedBy}`
      );
    })
    .on("trackAdd", (msg, queue, track) => {
      msg.channel.send(`**${track.title}** has been added to the queue!`);
    })
    .on("playlistAdd", (msg, queue, playlist) => {
      msg.channel.send(
        `${playlist.title} has been added to the queue! There are ${
          playlist.items.length
        } ${playlist.items.length !== 1 ? "songs" : "song"}!`
      );
    })
    .on("searchResults", (msg, query, tracks) => {
      const msgEmbed = new MessageEmbed()
        .setAuthor(`Here are your search results for ${query}:`)
        .setDescription(
          tracks.map((t, i) => `${i + 1}. ${t.title} (${ms(t.durationMS)})`)
        )
        .setFooter(`Type the number of the song you want to play!`);

      msg.channel.send(msgEmbed);
    })
    .on("searchInvalidResponse", (msg, query, tracks, content, collector) => {
      msg.channel.send(
        `You must type a valid number between 1 and ${tracks.length}!`
      );
    })
    .on("searchCancel", (msg, query, tracks) => {
      msg.channel.send(
        `You did not provide a valid response! Please send the command again.`
      );
    })
    .on("noResults", (msg, query) => {
      msg.channel.send(`No results found for ${query}.`);
    })
    .on("queueEnd", (msg, queue) => {
      msg.channel.send(`Music stopped as there is no more music in the queue.`);
    })
    .on("channelEmpty", (msg, queue) => {
      msg.channel.send(
        `Music stopped as there are no more members in the voice channel.`
      );
    })
    .on("botDisconnect", (msg) => {
      msg.channel.send(
        `Music stopped as I have been disconnected from the voice channel.`
      );
    })
    .on("error", (err, msg) => {
      switch (err) {
        case "NotPlaying":
          msg.channel.send(
            `There is no music currently playing on the server!`
          );
          break;
        case "NotConnected":
          msg.channel.send(
            `You need to be in a voice channel in order to play music!`
          );
          break;
        case "UnableToJoin":
          msg.channel.send(
            `I need the permissions to join and speak in your voice channel.`
          );
          break;
        default:
          msg.channel.send(`Something went wrong... Error: ${err}`);
          break;
      }
    });
};
