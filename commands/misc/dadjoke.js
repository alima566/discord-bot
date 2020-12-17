const fetch = require("node-fetch");
const { log } = require("@utils/functions");

module.exports = {
  commands: "dadjoke",
  category: "Misc",
  cooldown: "15s",
  description: "KelleeBot tells you a random dad joke.",
  callback: async (msg) => {
    let m = await msg.channel.send(`Let me think of a dad joke...`);
    fetch(`https://icanhazdadjoke.com/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => m.edit(data.joke))
      .catch((e) => {
        log(
          "ERROR",
          "./commands/misc/dadjoke.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
  /*fetch(`https://dad-jokes.p.rapidapi.com/random/joke`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        m.edit(`${data.body[0].setup} ${data.body[0].punchline}`);
      })
      .catch(err => {
        console.log(err);
      });*/
};
