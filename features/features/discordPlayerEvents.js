const { MessageEmbed, Util } = require("discord.js");
const { paginateEmbed, chunkArray } = require("@utils/functions");

module.exports = (client) => {
  client.player
    .on("trackStart", (msg, track) => {
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor("Now Playing", `${msg.guild.iconURL()}`)
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
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor("Track Added", `${msg.guild.iconURL()}`)
        .setDescription(
          `[${Util.escapeMarkdown(track.title)}](${track.url}) (${
            track.duration
          }) has been added to the queue!`
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
            `${msg.guild.iconURL()}`
          )
          .setFooter(
            `Type the number of the song you want to play! Type "cancel" to cancel.`
          );
        let counter = i == 1 ? 10 : 0;
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
          .setAuthor("Search Canceled", `${msg.guild.iconURL()}`)
          .setDescription(`❌ | You have canceled the search for "${query}".`);
        return msg.channel.send(msgEmbed);
      }
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor("Invalid Response", `${msg.guild.iconURL()}`)
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
        .setAuthor("Search Canceled", `${msg.guild.iconURL()}`)
        .setDescription(
          `❌ | You did not provide a valid response! Please send the command again.`
        );
      msg.channel.send(msgEmbed);
    })
    .on("noResults", (msg, query) => {
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor("No Results", `${msg.guild.iconURL()}`)
        .setDescription(`❌ | No results were found for "${query}".`);
      msg.channel.send(msgEmbed);
    })
    .on("queueEnd", (msg, queue) => {
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor(`No More Music`, `${msg.guild.iconURL()}`)
        .setDescription(
          `⏹️ | Music stopped as there is no more music in the queue.`
        );
      msg.channel.send(msgEmbed);
    })
    .on("channelEmpty", (msg, queue) => {
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor(`Voice Channel Empty`, `${msg.guild.iconURL()}`)
        .setDescription(
          `⏹️ | Music stopped as there are no more members in the voice channel.`
        );
      msg.channel.send(msgEmbed);
    })
    .on("botDisconnect", (msg) => {
      const msgEmbed = new MessageEmbed()
        .setColor("#1ED761")
        .setAuthor("Bot Disconnected", `${msg.guild.iconURL()}`)
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
            .setAuthor("No Music", `${msg.guild.iconURL()}`)
            .setDescription(
              `❌ | No music is currently playing on the server!`
            );
          msg.channel.send(msgEmbed);
          break;
        case "NotConnected":
          msgEmbed
            .setAuthor("Not Connected", `${msg.guild.iconURL()}`)
            .setDescription(
              `❌ | You need to be in a voice channel in order to play music!`
            );
          msg.channel.send(msgEmbed);
          break;
        case "UnableToJoin":
          msgEmbed
            .setAuthor("No Permissions", `${msg.guild.iconURL()}`)
            .setDescription(
              `❌ | I don't have permissions to join and speak in your voice channel!`
            );
          msg.channel.send(msgEmbed);
          break;
        default:
          msg.channel.send(`Something went wrong... Error: ${err}`);
          break;
      }
    });
};

module.exports.config = {
  displayName: "Discord Player Events",
  dbName: "DISCORD_PLAYER_EVENTS",
  loadDBFirst: false,
};
