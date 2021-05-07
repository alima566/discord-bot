const fetch = require("node-fetch");
const { log } = require("@utils/functions");

module.exports = {
  slash: "both",
  category: "🎮 Fun",
  cooldown: "15s",
  description: "KelleeBot tells you a random dad joke.",
  callback: async ({ message }) => {
    try {
      const resp = await fetch("https://icanhazdadjoke.com/", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await resp.json();
      return message ? message.channel.send(data.joke) : data.joke;
    } catch (e) {
      log(
        "ERROR",
        "./commands/misc/dadjoke.js",
        `An error has occurred: ${e.message}`
      );
      return message
        ? message.channel.send("Oops, an error occurred. Please try again.")
        : "Oops, an error occurred. Please try again.";
    }
  },
};
