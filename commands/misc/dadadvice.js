const fetch = require("node-fetch");
module.exports = {
  commands: "dadadvice",
  cooldown: 15,
  description: "KelleeBot gives you a random dad advice.",
  callback: (msg, args, text) => {
    fetch(`https://api.adviceslip.com/advice`) //`https://api.scorpstuff.com/advice.php`)
      .then((response) => response.json())
      .then((data) => {
        msg.channel.send(`${data["slip"]["advice"]}`);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
