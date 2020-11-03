module.exports = {
  commands: "fc",
  cooldown: 15,
  description: "Kéllee's Nintendo Switch friend code.",
  callback: (msg, args, text) => {
    msg.channel.send(`Kellee's Switch friend code: SW-1603-0974-7504`);
    return;
  },
};
