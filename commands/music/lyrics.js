const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

module.exports = {
  commands: "lyrics",
  category: "Music",
  expectedArgs: "<song_title> - <artist>",
  minArgs: 0,
  maxArgs: -1,
  description:
    "Shows lyrics for either what's currently playing or for what's specfied.",
  cooldown: "15s",
  callback: async (msg, args) => {
    let songName = "";
    const nowPlaying = msg.client.player.nowPlaying(msg);
    if (args.length === 0 && nowPlaying) {
      songName = removeCharacters(nowPlaying.title);
    } else if (args.length > 0) {
      songName = args.join(" ");
    } else {
      return msg.channel.send(`Please specify song and artist.`);
    }

    let m = await msg.channel.send(`Searching for lyrics...`);
    //getSongTitle(songName)
    //.then(songName => {
    searchSong(songName) //https://some-random-api.ml/lyrics?title=
      .then((url) => {
        getSongPageURL(url)
          .then((url) => {
            getLyrics(url)
              .then((lyrics) => {
                if (lyrics.length > 4095) {
                  m.edit(
                    `Lyrics are too long to be returned in a message embed.`
                  );
                  return;
                }
                if (lyrics.length < 2048) {
                  let lyricsEmbed = new MessageEmbed()
                    .setColor("#00724E")
                    .setTitle(songName)
                    .setDescription(lyrics.trim())
                    .setFooter(`Lyrics provided by Genius.com`);
                  m.edit(`Here's what I found.`);
                  return msg.channel.send(lyricsEmbed);
                } else {
                  // 2048 < lyrics.length < 4096
                  let firstLyricsEmbed = new MessageEmbed()
                    .setColor("#00724E")
                    .setTitle(songName)
                    .setDescription(lyrics.slice(0, 2048))
                    .setFooter(`Lyrics provided by Genius.com`);
                  let secondLyricsEmbed = new MessageEmbed()
                    .setColor("#00724E")
                    .setDescription(lyrics.slice(2048, lyrics.length))
                    .setFooter(`Lyrics provided by Genius.com`);
                  m.edit(`Here's what I found.`);
                  msg.channel.send(firstLyricsEmbed);
                  msg.channel.send(secondLyricsEmbed);
                }
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

function removeCharacters(songName) {
  // remove stuff like (Official Video)
  songName = songName.replace(/ *\([^)]*\) */g, "");

  // remove emojis
  songName = songName.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ""
  );
  return songName;
}

function searchSong(query) {
  return new Promise(async function (resolve, reject) {
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
}

function getSongTitle(query) {
  return new Promise(async function (resolve, reject) {
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
}

function getSongPageURL(url) {
  return new Promise(async function (resolve, reject) {
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
}

function getLyrics(url) {
  return new Promise(async function (resolve, reject) {
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
}
