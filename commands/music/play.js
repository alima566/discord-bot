module.exports = {
  commands: "play",
  category: "Music",
  expectedArgs: "<Search query>",
  minArgs: 1,
  maxArgs: -1,
  description: "Plays the specified song.",
  callback: async (msg, args) => {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) {
      return msg.reply(
        `You need to be in a voice channel in order to play music!`
      );
    }
    await msg.client.player.play(msg, args.join(" "), msg.member.user);
    return;
  },
};
