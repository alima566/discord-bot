module.exports = {
  commands: ["nowplaying", "np", "currentsong"],
  category: "Music",
  description: "Shows what's currently playing.",
  callback: async (msg) => {
    msg.client.player.nowPlaying(msg);
  },
};
