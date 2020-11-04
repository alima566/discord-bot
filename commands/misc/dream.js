module.exports = {
  commands: "dream",
  cooldown: 15,
  description: "Kéllee's ACNH dream address.",
  callback: (msg, args, text) => {
    msg.channel.send(
      `Kellee's AC Island's dream address is: DA-9394-6234-2828`
    );
    return;
  },
};
