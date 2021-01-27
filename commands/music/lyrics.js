const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");
const { log, paginateEmbed } = require("@utils/functions");

module.exports = {
  category: "Music",
  expectedArgs: "<song_title> - <artist>",
  minArgs: 0,
  maxArgs: -1,
  description:
    "Shows lyrics for either what's currently playing or for what's specfied.",
  cooldown: "15s",
  callback: async ({ message, args }) => {
    let songName = "";
    const isPlaying = message.client.player.isPlaying(message);
    if (args.length === 0 && isPlaying) {
      const currentSong = message.client.player.nowPlaying(message);
      songName = removeCharacters(currentSong.title);
    } else if (args.length > 0) {
      songName = args.join(" ");
    } else {
      return message.channel.send(`Please specify song and artist.`);
    }

    let m = await message.channel.send(`Searching for lyrics...`);
    //getSongTitle(songName)
    //.then(songName => {
    searchSong(songName) //https://some-random-api.ml/lyrics?title=
      .then((url) => {
        getSongPageURL(url)
          .then((url) => {
            getLyrics(url)
              .then((lyrics) => {
                const embedArray = [];
                let lyricsArray = splitLyrics(lyrics);
                if (lyricsArray.length == 1) {
                  const lyricsEmbed = new MessageEmbed()
                    .setColor("#1ED761")
                    .setTitle(songName)
                    .setDescription(lyrics.trim())
                    .setFooter(`Lyrics provided by Genius.com`);
                  m.edit(`Here's what I found.`);
                  return message.channel.send(lyricsEmbed);
                }
                for (let i = 0; i < lyricsArray.length; i++) {
                  let text = "";
                  const lyricsEmbed = new MessageEmbed()
                    .setColor("#1ED761")
                    .setTitle(songName)
                    .setFooter(
                      `Lyrics provided by Genius.com | Page ${i + 1} of ${
                        lyricsArray.length
                      }`
                    );
                  text += lyricsArray[i];
                  lyricsEmbed.setDescription(text.trim());
                  embedArray.push(lyricsEmbed);
                }
                m.edit(`Here's what I found.`);
                paginateEmbed(message, embedArray, { time: 1000 * 60 * 10 });
              })
              .catch((e) => m.edit(e));
          })
          .catch((e) => m.edit(e));
      })
      .catch((e) => m.edit(e));
    //})
    //.catch(err => msg.channel.send(err));
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

const searchSong = (query) => {
  return new Promise(async (resolve, reject) => {
    const searchURL = `https://api.genius.com/search?q=${encodeURI(query)}`;
    const headers = {
      Authorization: `Bearer ${process.env.GENIUS_AUTH}`,
    };
    try {
      const body = await fetch(searchURL, { headers });
      const result = await body.json();
      const songPath = result.response.hits[0].result.api_path;
      resolve(`https://api.genius.com${songPath}`);
    } catch (e) {
      reject("No song has been found for this query");
    }
  });
};

const getSongTitle = (query) => {
  return new Promise(async (resolve, reject) => {
    const searchURL = `https://api.genius.com/search?q=${encodeURI(query)}`;
    const headers = {
      Authorization: `Bearer ${process.env.GENIUS_AUTH}`,
    };
    try {
      const body = await fetch(searchURL, { headers });
      const result = await body.json();
      const songTitle = result.response.hits[0].result.full_title;
      resolve(songTitle.replace(/ by +/, " - "));
    } catch (e) {
      reject("No song has been found for this query");
    }
  });
};

const getSongPageURL = (url) => {
  return new Promise(async (resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${process.env.GENIUS_AUTH}`,
    };
    try {
      const body = await fetch(url, { headers });
      const result = await body.json();
      if (!result.response.song.url) {
        reject("There was a problem finding a URL for this song");
      } else {
        resolve(result.response.song.url);
      }
    } catch (e) {
      log(
        "ERROR",
        "./commands/music/lyrics.js",
        `An error has occurred: ${e.message}`
      );
      reject("There was a problem finding a URL for this song");
    }
  });
};

const getLyrics = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const $ = cheerio.load(text);
      let lyrics = $(".lyrics").text().trim();
      if (!lyrics) {
        $(".Lyrics__Container-sc-1ynbvzw-2").find("br").replaceWith("\n");
        lyrics = $(".Lyrics__Container-sc-1ynbvzw-2").text();
        if (!lyrics) {
          reject(
            "There was a problem fetching lyrics for this song, please try again"
          );
        } else {
          resolve(lyrics);
          //resolve(lyrics.replace(/(\[.+\])/g, ""));
        }
      } else {
        resolve(lyrics);
        //resolve(lyrics.replace(/(\[.+\])/g, ""));
      }
    } catch (e) {
      log(
        "ERROR",
        "./commands/music/lyrics.js",
        `An error has occurred: ${e.message}`
      );
      reject(
        "There was a problem fetching lyrics for this song, please try again"
      );
    }
  });
};

const splitLyrics = (string) => {
  let chunks = [];
  for (let i = 0; i < string.length; i += 2047) {
    chunks.push(string.substring(i, i + 2047));
  }
  return chunks;
};
