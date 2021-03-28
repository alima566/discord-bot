const { MessageEmbed, Util } = require("discord.js");
const { paginateEmbed, chunkArray, guildIcon } = require("@utils/functions");

module.exports = (client) => {
  client.player
    .on("trackStart", (msg, track) => {
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor("Now Playing", `${guildIcon(msg.guild)}`)
        .setDescription(
          `[${Util.escapeMarkdown(track.title)}](${track.url}) (${
            track.duration
          })`
        )
        .setFooter(
          `Requested by ${track.requestedBy.tag}`,
          `${track.requestedBy.displayAvatarURL({ dynamic: true })}`
        )
        .setThumbnail(`${track.thumbnail}`);
      msg.channel.send(msgEmbed);
    })
    .on("trackAdd", (msg, queue, track) => {
      const tracks = queue.tracks;
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor("Track Added", `${guildIcon(msg.guild)}`)
        .setDescription(
          `[${Util.escapeMarkdown(track.title)}](${track.url}) (${
            track.duration
          }) has been added to the queue!\n\nThere's now \`${
            tracks.length
          }\` song${tracks.length !== 1 ? "s" : ""} in the queue.`
        )
        .setFooter(
          `Added by ${track.requestedBy.tag}`,
          `${track.requestedBy.displayAvatarURL({ dynamic: true })}`
        )
        .setThumbnail(`${track.thumbnail}`);
      msg.channel.send(msgEmbed);
    })
    .on("playlistAdd", (msg, queue, playlist) => {
      msg.channel.send(
        `${playlist.title} has been added to the queue! There are ${
          playlist.items.length
        } ${playlist.items.length !== 1 ? "songs" : "song"}!`
      );
    })
    .on("searchResults", (msg, query, tracks) => {
      const embedArray = [];
      let tracksArray = chunkArray(tracks, 10);
      for (let i = 0; i < tracksArray.length; i++) {
        let text = `Page ${i + 1} of ${tracksArray.length}\n\n`;
        const embed = new MessageEmbed()
          .setColor("#1ED761")
          .setAuthor(
            `Here are your search results for ${query}:`,
            `${guildIcon(msg.guild)}`
          )
          .setFooter(
            `Type the number of the song you want to play! Type "cancel" to cancel.`
          );
        let counter = (i + 1) * 10 - 10;
        for (let j = 0; j < tracksArray[i].length; j++) {
          text += `${counter + 1}. [${Util.escapeMarkdown(
            tracksArray[i][j].title
          )}](${tracksArray[i][j].url}) (${tracksArray[i][j].duration})\n`;
          counter++;
        }
        embed.setDescription(text);
        embedArray.push(embed);
      }
      paginateEmbed(msg, embedArray, { time: 60000 });
    })
    .on("searchInvalidResponse", (msg, query, tracks, content, collector) => {
      if (content.toLowerCase() === "cancel") {
        collector.stop();
        const msgEmbed = new MessageEmbed()
          .setColor("#1ED761")
          .setAuthor("Search Canceled", `${guildIcon(msg.guild)}`)
          .setDescription(`❌ | You have canceled the search for "${query}".`);
        return msg.channel.send(msgEmbed);
      }
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor("Invalid Response", `${guildIcon(msg.guild)}`)
        .setDescription(
          `❌ | You must type a valid number between 1 and ${tracks.length}!`
        )
        .setFooter(
          `Type the number of the song you want to play! Type "cancel" to cancel.`
        );
      msg.channel.send(msgEmbed);
    })
    .on("searchCancel", (msg, query, tracks) => {
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor("Search Canceled", `${guildIcon(msg.guild)}`)
        .setDescription(
          `❌ | You did not provide a valid response! Please send the command again.`
        );
      msg.channel.send(msgEmbed);
    })
    .on("noResults", (msg, query) => {
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor("No Results", `${guildIcon(msg.guild)}`)
        .setDescription(`❌ | No results were found for "${query}".`);
      msg.channel.send(msgEmbed);
    })
    .on("queueEnd", (msg, queue) => {
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor(`No More Music`, `${guildIcon(msg.guild)}`)
        .setDescription(
          `⏹️ | Music stopped as there is no more music in the queue.`
        );
      msg.channel.send(msgEmbed);
    })
    .on("channelEmpty", (msg, queue) => {
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor(`Voice Channel Empty`, `${guildIcon(msg.guild)}`)
        .setDescription(
          `⏹️ | Music stopped as there are no more members in the voice channel.`
        );
      msg.channel.send(msgEmbed);
    })
    .on("botDisconnect", (msg) => {
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor("Bot Disconnected", `${guildIcon(msg.guild)}`)
        .setDescription(
          `⏹️ | Music stopped as I have been disconnected from the voice channel.`
        );
      msg.channel.send(msgEmbed);
    })
    .on("error", (err, msg) => {
      const msgEmbed = new MessageEmbed().setColor("#1ED761");
      switch (err) {
        case "NotPlaying":
          msgEmbed
            .setAuthor("No Music", `${guildIcon(msg.guild)}`)
            .setDescription(
              `❌ | No music is currently playing on the server!`
            );
          return msg.channel.send(msgEmbed);
        case "NotConnected":
          msgEmbed
            .setAuthor("Not Connected", `${guildIcon(msg.guild)}`)
            .setDescription(
              `❌ | You need to be in a voice channel in order to play music!`
            );
          return msg.channel.send(msgEmbed);
        case "UnableToJoin":
          msgEmbed
            .setAuthor("No Permissions", `${guildIcon(msg.guild)}`)
            .setDescription(
              `❌ | I don't have permissions to join and speak in your voice channel!`
            );
          return msg.channel.send(msgEmbed);
        case "LiveVideo":
          msgEmbed
            .setAuthor("Not Supported", `${guildIcon(msg.guild)}`)
            .setDescription(`❌ | YouTube Lives are not supported.`);
          return msg.channel.send(msgEmbed);
        case "VideoUnavailable":
          msgEmbed
            .setAuthor("Video Unavailable", `${guildIcon(msg.guild)}`)
            .setDescription(`❌ | This YouTube video is not available.`);
          return msg.channel.send(msgEmbed);
        default:
          return msg.channel.send(`Something went wrong... Error: ${err}`);
      }
    });
};

module.exports.config = {
  displayName: "Discord Player Events",
  dbName: "DISCORD_PLAYER_EVENTS",
  loadDBFirst: false,
};
