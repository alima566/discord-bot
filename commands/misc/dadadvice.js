const fetch = require("node-fetch");
const { log } = require("@utils/functions");

module.exports = {
  commands: "dadadvice",
  category: "Misc",
  cooldown: "15s",
  description: "KelleeBot gives you a random dad advice.",
  callback: ({ message }) => {
    fetch(`https://api.adviceslip.com/advice`) //`https://api.scorpstuff.com/advice.php`)
      .then((response) => response.json())
      .then((data) => {
        message.channel.send(`${data["slip"]["advice"]}`);
      })
      .catch((e) => {
        log(
          "ERROR",
          "./commands/misc/dadadvice.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
};
