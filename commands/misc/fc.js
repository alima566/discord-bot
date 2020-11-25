module.exports = {
  commands: "fc",
  category: "Misc",
  cooldown: "15s",
  description: "Kéllee's Nintendo Switch friend code.",
  callback: (msg) => {
    msg.channel.send(`Kellee's Switch friend code: SW-1603-0974-7504`);
    return;
  },
};
