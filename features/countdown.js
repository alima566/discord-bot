const gamblingSchema = require("@schemas/gambling-schema");
const numeral = require("numeral");
const { MessageEmbed } = require("discord.js");

const seconds = 5;
const startingCounter = 60;
let counter = startingCounter;
let importantData = "";

const fetchData = async () => {
  importantData += "\n";
  //importantData = "Hello world";
};

const getText = () => {
  return `${importantData}\n\nUpdating in ${counter}s...`;
};

const updateCounter = async (message) => {
  message.edit(getText());
  counter -= seconds;
  if (counter <= 0) {
    counter = startingCounter;
    await fetchData();
  }
  setTimeout(() => {
    updateCounter(message);
  }, 1000 * seconds);
};

module.exports = async (client) => {
  await fetchData();
  const guild = client.guilds.cache.get("707103910686621758"); //.first();
  const channel = guild.channels.cache.get("771015880883699732");

  const message = await channel.send(getText());

  updateCounter(message);
};
