module.exports = {
  commands: ["nowplaying", "np", "currentsong"],
  category: "Music",
  description: "Shows what's currently playing.",
  callback: async (msg) => {
    const track = msg.client.player.nowPlaying(msg);
    if (track !== "undefined") {
      return msg.channel.send(`Now playing: **${track.title}**`);
    } else {
      return msg.channel.send(`There is currently no song playing.`);
    }
  },
};
