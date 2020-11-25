module.exports = {
  commands: "dream",
  category: "Misc",
  cooldown: "15s",
  description: "Kéllee's ACNH dream address.",
  callback: (msg) => {
    msg.channel.send(
      `Kellee's AC Island's dream address is: DA-9394-6234-2828`
    );
    return;
  },
};
