const fetch = require("node-fetch");
const { MessageEmbed, Util } = require("discord.js");
const { log, paginateEmbed } = require("@utils/functions");

module.exports = {
  category: "🎵 Music",
  expectedArgs: "<song_title> <artist>",
  minArgs: 0,
  maxArgs: -1,
  description:
    "Shows lyrics for either what's currently playing or for what's specfied.",
  cooldown: "15s",
  callback: async ({ message, text }) => {
    let songName = "";
    const isPlaying = message.client.player.isPlaying(message);
    if (text.length === 0 && isPlaying) {
      const currentSong = message.client.player.nowPlaying(message);
      songName = removeCharacters(currentSong.title);
    } else if (text.length > 0) {
      songName = text;
    } else {
      return message.channel.send(`Please specify song and artist.`);
    }

    let m = await message.channel.send(`Searching for lyrics...`);
    fetch(
      `https://api.ksoft.si/lyrics/search?q=${encodeURIComponent(
        songName
      )}&limit=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.KSOFT_API_TOKEN}`,
        },
      }
    )
      .then((resp) => resp.json())
      .then((res) => {
        const { artist, name, lyrics, album_art } = res.data[0];
        if (res.data[0].length === 0) {
          return m.edit(`No lyrics were found for "${songName}"`);
        }

        const embedArray = [];
        let lyricsArray = Util.splitMessage(lyrics);
        if (lyricsArray.length == 1) {
          const lyricsEmbed = new MessageEmbed()
            .setColor("#1ED761")
            .setTitle(`${artist} - ${name}`)
            .setThumbnail(album_art)
            .setDescription(lyrics.trim())
            .setFooter(`Lyrics provided by KSoft.Si`);

          return m.edit(`Here's what I found.`, lyricsEmbed);
        }

        for (let i = 0; i < lyricsArray.length; i++) {
          let songLyrics = "";
          const lyricsEmbed = new MessageEmbed()
            .setColor("#1ED761")
            .setTitle(`${artist} - ${name}`)
            .setFooter(
              `Lyrics provided by KSoft.Si | Page ${i + 1} of ${
                lyricsArray.length
              }`
            );
          songLyrics += lyricsArray[i];
          lyricsEmbed.setDescription(songLyrics.trim());
          embedArray.push(lyricsEmbed);
        }
        m.edit(`Here's what I found.`);
        paginateEmbed(message, embedArray, { time: 1000 * 60 * 10 });
      })
      .catch((e) => {
        log(
          "ERROR",
          "./commands/music/lyrics.js",
          `An error has occurred: ${e.message}`
        );
        return m.edit(`An error has occurred. Please try again.`);
      });
  },
};

const removeCharacters = (songName) => {
  // remove stuff like (Official Video)
  songName = songName.replace(/ *\([^)]*\) */g, "");

  // remove emojis
  songName = songName.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ""
  );
  return songName;
};
