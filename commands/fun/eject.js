const { MessageEmbed } = require("discord.js");
const { getRandomNumber } = require("@utils/functions");

const colors = [
  "black",
  "blue",
  "brown",
  "cyan",
  "darkgreen",
  "lime",
  "orange",
  "pink",
  "purple",
  "red ",
  "white",
  "yellow",
];

module.exports = {
  category: "🎮 Fun",
  cooldown: "15s",
  minArgs: 0,
  maxArgs: 1,
  expectedArgs: "[User to eject]",
  description: "Ejects a member from the spaceship.",
  callback: async ({ message }) => {
    const target = message.mentions.users.first() || message.author;
    const index = getRandomNumber(colors);
    const crewmateColor = colors[index];
    const imposter = isImposter() == 1 ? true : false;

    const img = `https://vacefron.nl/api/ejected?name=${encodeURIComponent(
      target.username
    )}&impostor=${imposter}&crewmate=${encodeURIComponent(crewmateColor)}`;

    const msgEmbed = new MessageEmbed()
      .setColor("#DFBCF5")
      .setDescription(
        message.author.id === target.id
          ? `${target.username} has decided to eject themselves from the spaceship.`
          : `${message.author.username} has decided to eject ${target.username} from the spaceship.`
      )
      .setImage(img);

    return message.channel.send(msgEmbed);
  },
};

const isImposter = () => {
  return Math.floor(Math.random() * 2);
};
