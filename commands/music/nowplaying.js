module.exports = {
  commands: ["nowplaying", "np", "currentsong"],
  category: "Music",
  description: "Shows what's currently playing.",
  callback: async (msg) => {
    const nowPlaying = msg.client.player.nowPlaying(msg);
    return msg.channel.send(
      `Currently playing: **${nowPlaying.title}** - Requested by ${nowPlaying.requestedBy}`
    );
  },
};
