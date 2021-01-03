module.exports = {
  commands: ["nowplaying", "np", "currentsong"],
  category: "Music",
  description: "Shows what's currently playing.",
  callback: async ({ message }) => {
    const nowPlaying = message.client.player.nowPlaying(message);
    return message.channel.send(
      `Currently playing: **${nowPlaying.title}** - Requested by ${nowPlaying.requestedBy}`
    );
  },
};
