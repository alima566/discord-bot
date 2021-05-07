const fetch = require("node-fetch");
const { log } = require("@utils/functions");

module.exports = {
  slash: "both",
  category: "🎮 Fun",
  cooldown: "15s",
  description: "KelleeBot gives you a random dad advice.",
  callback: async ({ message }) => {
    try {
      const resp = await fetch(`https://api.adviceslip.com/advice`);
      const data = await resp.json();
      return message
        ? message.channel.send(data.slip.advice)
        : data.slip.advice;
    } catch (e) {
      log(
        "ERROR",
        "./commands/misc/dadadvice.js",
        `An error has occurred: ${e.message}`
      );
      return message
        ? message.channel.send("Oops, an error occurred. Please try again.")
        : "Oops, an error occurred. Please try again.";
    }
  },
};
