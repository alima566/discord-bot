module.exports = {
  commands: "play",
  category: "Music",
  expectedArgs: "<Search query>",
  minArgs: 1,
  maxArgs: -1,
  description: "Plays the specified song.",
  callback: async (msg, args) => {
    await msg.client.player.play(msg, args.join(" "), msg.member.user);
    return;
  },
};
